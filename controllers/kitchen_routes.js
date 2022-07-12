// ========== Imports ==========
const express = require("express");
const router = express.Router();
const Ingredient = require("../models/ingredient.js");

// ========== Routes ==========
router.get("/", (req, res) => {
  res.send("hello kitchen!");
});

// ========== Exports ==========
module.exports = router;