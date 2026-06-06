const { Movie } = require("../models");

const authorization = async (req, res, next) => {
  try {
    let movie = await Movie.findByPk(req.params.id);

    if (!movie) {
      throw { name: "NotFound" };
    }

    if (movie.UserId !== req.user.id) {
      throw { name: "Forbidden" };
    }

    // console.log(movie);
    next();
  } catch (error) {
    if (error.name === "NotFound") {
      return res.status(404).json({ message: "Data Not Found" });
    }
    if (error.name === "Forbidden") {
      return res.status(403).json({ message: "You are not authorized" });
    }
  }
};

module.exports = authorization;
