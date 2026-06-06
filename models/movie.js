"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Movie.belongsTo(models.User, { foreignKey: "UserId" });
    }
  }
  Movie.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "title is required",
          },
          notEmpty: {
            msg: "title is required",
          },
        },
      },

      coverUrl: DataTypes.STRING,
      synopsis: DataTypes.TEXT,
      releaseDate: DataTypes.DATE,
      duration: DataTypes.INTEGER,
      rating: DataTypes.FLOAT,
      isNowShowing: DataTypes.BOOLEAN,
      UserId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Movie",
    },
  );
  return Movie;
};
