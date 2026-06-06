const { hashSync, compareSync } = require("bcryptjs");

module.exports = {
  hashPassword: (password) => hashSync(password),
  comparePassword: (passwordInputan, passwordDb) =>
    compareSync(passwordInputan, passwordDb),
};
