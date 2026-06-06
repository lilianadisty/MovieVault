const { Movie, User } = require("../models");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const { comparePassword } = require("../helper/bycript");
const { createToken } = require("../helper/jwt");

const axios = require("axios");

class Controller {
  static async getHello(req, res) {
    res.json({ message: "Hellow" });
  }

  static async getUser(req, res) {
    try {
      const data = await User.findAll();
      res.json(data);
    } catch (error) {
      console.log(error);
    }
  }

  static async register(req, res, next) {
    try {
      console.log(req.body);

      const { email, password } = req.body || {};
      const user = await User.create({ email, password });
      console.log(user);

      res.status(201).json({
        message: "register successfully",
        email: user.email,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res) {
    try {
      let { email, password } = req.body;

      if (!email || !password) {
        throw { name: "InvalidInput" };
      }

      const user = await User.findOne({ where: { email } });

      // console.log(user.password);

      // cek user dulu
      if (!user) {
        throw { name: "InvalidUser" };
      }

      let compare = comparePassword(password, user.password);
      // console.log(compare);

      // cek password
      if (!compare) {
        throw { name: "InvalidUser" };
      }

      // let token = createToken({
      //   id: user.email,
      // });

      let token = createToken({
        id: user.id,
      });

      // console.log(user);
      res.status(200).json({
        // status: true,
        // message: "Login Berhasil",
        // user: user,
        access_token: token,
      });
    } catch (error) {
      console.log(error);
      if (error.name === "InvalidInput") {
        return res
          .status(400)
          .json({ message: "email / password is required" });
      }

      if (error.name === "InvalidUser") {
        return res.status(401).json({
          message: "Invalid email / password",
        });
      }

      res.status(500).json(error);
      console.log(error);
    }
  }

  static async getMovies(req, res, next) {
    try {
      const movies = await Movie.findAll();

      console.log(movies);

      res.json({
        message: "Ini List Movies",
        movies: movies,
      });
    } catch (error) {
      next();
    }
  }

  static async getNowShowingMovies(req, res, next) {
    try {
      const response = await axios({
        method: "GET",
        url: "https://api.themoviedb.org/3/movie/now_playing",
        params: {
          api_key: process.env.TMDB_API_KEY,
        },
      });

      console.log(response.data.results);

      const listNowPlayingMovies = response.data.results.map((e) => {
        return {
          title: e.title,
          synopsis: e.overview,
          releaseDate: e.release_date,
          coverUrl: "https://image.tmdb.org/t/p/w500" + e.poster_path,
          rating: e.vote_average,
        };
      });

      // res.json(response.data.results);
      res.json(listNowPlayingMovies);
    } catch (error) {
      next();
    }
  }

  static async getMovieById(req, res) {
    try {
      const movie = await Movie.findByPk(req.params.id);

      if (!movie) {
        throw { name: "NotFound" };

        // res.status(404).json({
        //   message: "Movie not found",
        // });
        // return; //supaya ga lanjut/crush ke res 200
      }

      res.status(200).json(movie);
    } catch (error) {
      console.log(error);
      if (error.name === "NotFound") {
        res.status(404).json({
          message: "Movie not found",
        });
        return; //kalau ga pake else
      }
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }

  static async createMovie(req, res, next) {
    try {
      const { title, synopsis, releaseDate, duration, rating, isNowShowing } =
        req.body;

      if (!req.file) {
        throw { name: "FileRequired" };
      }

      // Convert buffer ke base64
      const base64String = req.file.buffer.toString("base64");
      const dataUrl = `data:${req.file.mimetype};base64,${base64String}`;

      // Upload ke Cloudinary
      const result = await cloudinary.uploader.upload(dataUrl, {
        // public_id: req.file.originalname,
        public_id: `movie-${Date.now()}`,
        folder: "try-la",
      });

      // Simpan URL Cloudinary ke database
      const movie = await Movie.create({
        title,
        coverUrl: result.secure_url,
        synopsis,
        releaseDate,
        duration,
        rating,
        isNowShowing,
        UserId: req.user.id,
      });

      res.status(201).json({
        message: "Success Create Movie",
        movie,
      });
    } catch (error) {
      next(error);
    }
  }

  // static async createMovie(req, res, next) {
  // try {
  //   // const movie = await Movie.create(req.body); //tanpa destructuring

  //   const {
  //     title,
  //     coverUrl,
  //     synopsis,
  //     releaseDate,
  //     duration,
  //     rating,
  //     isNowShowing,
  //   } = req.body;

  //   const movie = await Movie.create({
  //     title,
  //     coverUrl,
  //     synopsis,
  //     releaseDate,
  //     duration,
  //     rating,
  //     isNowShowing,
  //     UserId: req.user.id,
  //   });
  //   console.log(req.body);
  //   console.log(movie);
  //   res.status(201).json({
  //     message: "Success Create Movie",
  //     movie: movie,
  //   });
  // } catch (error) {
  //   next(error);

  // }
  //}

  static async editMovie(req, res) {
    // ada 2 cara

    //| Cara                  Kelebihan         | Kekurangan                      |
    //| `update(req.body)` | singkat            | rawan update field yang tidak diinginkan |
    //| destructuring lalu update satu-satu | lebih aman & jelas | lebih verbose                            |

    //vs

    //Ini lebih explicit dan biasanya lebih aman karena:

    //hanya field tertentu yang boleh diupdate
    //mencegah user inject field lain (id, createdAt, dll)
    //lebih jelas field mana yang dipakai ,Biasanya production pakai cara kedua. Karena lebih secure dan predictable.

    try {
      const {
        title,
        coverUrl,
        synopsis,
        releaseDate,
        duration,
        rating,
        isNowShowing,
      } = req.body;

      const movie = await Movie.findByPk(req.params.id);

      if (!movie) {
        throw { name: "NotFound" };
      }

      await movie.update({
        //ini instance movie
        title,
        coverUrl,
        synopsis,
        releaseDate,
        duration,
        rating,
        isNowShowing,
      });

      res.status(200).json(movie);

      // try {
      //   const movie = await Movie.findByPk(req.params.id);

      //   if (!movie) throw { name: "NotFound" };

      //   //await Movie.update(req.body, { where: {id: req.params.id}})
      //   await movie.update(req.body);

      //   res.status(200).json({ message: "Success update id " + req.params.id });
      // }
    } catch (error) {
      console.log(error);

      if (error.name === "NotFound") {
        return res.status(404).json({
          message: "Movie not found",
        });
      }
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({
          message: error.errors[0].message,
        });
      }
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  } //Alurnya si put: (Ambil req body, lalu movie nya berdasarkan req.params.id, kalau movie nya ga ketemu kita throw not found dan kita handle not found dg catch block response 404, lalu update movie nya berdasarkan req.body(dengan cara instance model jadi ga perlu pake where lagi karena dia udh tahu ini movie id mana karena ini instance model nya >>await movie.update<<, lalu kita res.json(200) movie install model nya). Nanti kalau ada gagal movie karena title string kosong langsung kena sequelize validation error, selain itu errornya di 500. )

  static async deleteMovie(req, res) {
    try {
      const movie = await Movie.findByPk(req.params.id);

      if (!movie) throw { name: "NotFound" };

      //await Movie.destroy({where: { id: req.params.id}})
      movie.destroy();
      res.status(200).json({ message: "Success delete id " + req.params.id });
    } catch (error) {
      if (error.name === "NotFound") {
        res.status(404).json({ message: "Movie does not exist" });
      } else {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async editTitleMovie(req, res) {
    try {
      const movie = await Movie.findByPk(req.params.id);

      if (!movie) throw { name: "NotFound" };

      //await Movie.update(req.body, { where: {id: req.params.id}})
      await movie.update(req.body);

      res.status(200).json({ message: "Success update id " + req.params.id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Sever Error" });
    }
  }

  static async editCoverUrl(req, res, next) {
    try {
      console.log(req.body, "<<<ini body");
      console.log(req.file, "<<<ini file");

      const movieId = req.params.id;
      const movie = await Movie.findByPk(req.params.id);
      if (!movie) {
        throw { name: "NotFound", message: `Movie id ${movieId} not found` };
      }

      if (!req.file) {
        throw { name: "FileRequired" };
      }

      const base64String = req.file.buffer.toString("base64");
      const dataUrl = `data:${req.file.mimetype};base64,${base64String}`;

      const result = await cloudinary.uploader.upload(dataUrl, {
        // public_id: req.file.originalname,
        public_id: `movie-${Date.now()}`,
        folder: "try-la",
      });
      // console.log(result);

      await movie.update({
        coverUrl: result.secure_url,
      });

      res.json({ message: `Movie ${movie.title} Cover url has been updated` });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
