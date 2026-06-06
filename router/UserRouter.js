const express = require("express");
const router = express.Router();

router.post("/register", (req, res) => {
  try {
    res.send("pastikan");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
