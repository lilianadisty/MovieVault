if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const app = express();

const PORT = process.env.PORT || 3000;
const cors = require("cors");

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let users = [];
// let getAlias = (email) => {
//   return email.split("@")[0];
// };

io.on("connection", (socket) => {
  console.log(`New user connected ${socket.id} `);
  console.log(socket.handshake.auth);

  const { getAlias } = socket.handshake.auth;

  if (socket.handshake.auth.token) {
    users.push({
      id: socket.id,
      username: socket.handshake.auth.username,
      // getAlias: userName(username),
    });
  }
  console.log(users);

  socket.emit("message", "INI DARI SOCKET SERVER ID: " + socket.id);

  io.emit("users:online", users);

  socket.on("messages:new", (newMessage) => {
    io.emit(
      "messages:info",
      newMessage,
      //   {
      //   ...newMessage,
      //   from: getAlias(username), // 👈 alias server
      //   id: Date.now(),

      // }
    );
  });

  socket.on("disconnect", () => {
    //socket.rooms.size
    users = users.filter((item) => item.id !== socket.id);
    io.emit("users:online", users);
  });
});

const Controller = require("./controller/controller");
const authentication = require("./middlewares/authenticate");
const authorization = require("./middlewares/authorization");
const errorHandler = require("./middlewares/errorHandler");

//middleware body-parser
app.use(express.urlencoded({ extended: false })); //utk data urlenco
app.use(express.json()); //utk nangkep req.body yang bentuknya json
app.use(cors());

app.get("/", authentication, Controller.getHello);
app.get("/users", authentication, Controller.getUser);
app.post("/user/register", Controller.register);
app.post("/user/login", Controller.login);

app.get("/movies", authentication, Controller.getMovies);
app.get("/movies/now-showing", Controller.getNowShowingMovies);
app.get("/movies/:id", authentication, Controller.getMovieById);
// app.post("/movies", authentication, Controller.createMovie);
app.post(
  "/movies",
  authentication,
  upload.single("coverUrl"),
  Controller.createMovie,
);
app.put("/movies/:id", authentication, authorization, Controller.editMovie);
app.delete(
  "/movies/:id",
  authentication,
  authorization,
  Controller.deleteMovie,
);
app.patch(
  "/movies/:id/title",
  authentication,
  authorization,
  Controller.editTitleMovie,
);
app.patch(
  "/movies/:id/cover-url",
  authentication,
  upload.single("iniCoverUrl"),
  Controller.editCoverUrl,
);

app.use(errorHandler);
httpServer.listen(PORT, () => {
  console.log(`Server can be access in http://localhost:${PORT}`);
});
