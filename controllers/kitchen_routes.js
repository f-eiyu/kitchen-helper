// ========== Imports ==========
const express = require("express");
const router = express.Router();
const Ingredient = require("../models/ingredient.js");

router.get("/", (req, res) => {
  res.send("hello kitchen!");
});

module.exports = router;