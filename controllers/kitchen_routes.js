// ========== Imports ==========
const express = require("express");
const router = express.Router();
const Ingredient = require("../models/ingredient.js");

// ========== Routes ==========
router.get("/", (req, res) => {
  Ingredient.find({})
    .then(ings => res.render("./kitchen/index.liquid", { ings }));
});

// ========== Exports ==========
module.exports = router;