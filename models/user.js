"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helper/bycript");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Movie, { foreignKey: "UserId" });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "email already declared",
        },
        validate: {
          notNull: {
            args: true,
            msg: "email is require",
          },
          notEmpty: {
            args: true,
            msg: "email is require",
          },
          isEmail: {
            args: true,
            msg: "Invalid format email",
          },
        },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: "Password is required",
          notEmpty: "Password is required",
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate(user) {
          user.password = hashPassword(user.password);
        },
      },
    },
  );
  return User;
};
