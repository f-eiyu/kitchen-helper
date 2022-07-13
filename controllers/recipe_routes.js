// ========== Imports ==========
const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe.js");

// ========== Routes ==========
// Index
router.get("/", (req, res) => {
  Recipe.find({})
    .then(recipes => res.render("./recipes/index.liquid", { recipes }))
    .catch(err => {
      console.error(err);
      res.send("Error in /recipes GET -- check the terminal.");
    });
});


// Delete
router.delete("/:recipeId", (req, res) => {
  Recipe.findByIdAndRemove(req.params.recipeId)
    .then(() => res.redirect("/recipes"))
    .catch(err => {
      console.error(err);
      res.send(`Error in /recipes/${req.params.recipeId} DELETE -- check the terminal.`);
    })
});

// ========== Exports ==========
module.exports = router;