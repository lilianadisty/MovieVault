const errorHandler = (err, req, res, next) => {
  console.log("🚀 ~ file: errorHandler.js:2 ~ errorHandler ~ err:", err);
  console.log("🚀 ~ file: errorHandler.js:2 ~ errorHandler ~ err:", err.name);

  if (err.message === "Unexpected end of form") {
    res.status(400).json({ message: "File is required" });
    return;
  }

  switch (err.name) {
    case "SequelizeValidationError":
    case "SequelizeUniqueConstraintError":
      res.status(400).json({ message: err.errors[0].message });
      return;
    case "FileRequired":
      res.status(400).json({ message: "File is required" });
      return;
    case "Unauthorized":
    case "JsonWebTokenError":
      res.status(401).json({ message: "Invalid token" });
      return;
    case "NotFound":
      res.status(404).json({ message: "Data not found" });
      return;
    case "Forbidden":
      res.status(403).json({ message: "Forbidden access" });
      return;
    default:
      res.status(500).json({ message: "Internal server error" });
      return;
  }
};

module.exports = errorHandler;

// function errorHandler(err, req, res, next) {
//   let status = err.status;
//   let message = err.message;

//   switch (err.name) {
//     case "InvalidInput":
//       status = 400;
//       message = "email / password is required";
//       break;

//     case "SequelizeValidationError":
//     case "SequelizeUniqueConstraintError":
//       status = 400;
//       message = err.errors.map((item) => item.message);
//   }

//   res.status(status).json({
//     message,
//   });

//   if (err.name === "SequelizeValidationError") {
//     res.status(400).json({
//       message: err.errors[0].message,
//     });
//   } else
//     res.status(500).json({
//       message: "Internal Server Error",
//     });
