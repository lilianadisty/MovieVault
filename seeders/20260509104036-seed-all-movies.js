"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../data/movie.json").map((el) => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    });
    // console.log(data);

    await queryInterface.bulkInsert("Movies", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Movies", null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  },
};
