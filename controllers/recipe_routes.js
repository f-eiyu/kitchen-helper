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

// New
router.get("/new", (req, res) => {
  res.render("./recipes/new.liquid");
});

// Create
router.post("/", (req, res) => {
  const submittedRecipe = req.body;

  const ingredientList = [];
  submittedRecipe.ingredients.forEach((ing, i) => {
    ingredientList.push({
      name: ing,
      amount: submittedRecipe.amounts[i]
    });
  });

  const favorite = (submittedRecipe.favorite === "on");

  let tags;
  if (submittedRecipe.tags.length) {
    tags = submittedRecipe.tags.split(",").map(tag => tag.trim());
  } else { tags = []; }

  let notes;
  if (submittedRecipe.notes.length) {
    notes = submittedRecipe.notes.split(",").map(note => note.trim());
  } else { notes = []; }

  const newRecipe = {
    name: submittedRecipe.name,
    ingredientList,
    instructions: submittedRecipe.instructions,
    favorite,
    tags,
    notes
  };

  Recipe.create(newRecipe)
    .then(recipe => {
      console.log(`Created recipe "${recipe.name}".`)
      res.redirect("/recipes");
    })
    .catch(err => {
      console.error(err);
      res.send(`Error in /recipes CREATE -- check the terminal.`);
    })
});

// Show
router.get("/:recipeId", (req, res) => {
  Recipe.findById(req.params.recipeId)
    .then(recipe => res.render("./recipes/show.liquid", { recipe }))
    .catch(err => {
      console.error(err);
      res.send(`Error in /recipes/${req.params.recipeID} SHOW -- check the terminal.`);
    });
});

// Edit

// Update

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