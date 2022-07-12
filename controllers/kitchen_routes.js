// ========== Imports ==========
const express = require("express");
const router = express.Router();
const Ingredient = require("../models/ingredient.js");

// ========== Routes ==========
// Index
router.get("/", (req, res) => {
  Ingredient.find({})
    .then(ings => res.render("./kitchen/index.liquid", { ings }))
    .catch(err => {
      console.error(err);
      res.send("Error in /kitchen GET -- check the terminal.");
    });
});

// Show
router.get("/:ingId", (req, res) => {
  Ingredient.findById(req.params.ingId)
    .then(ing => res.render("./kitchen/show.liquid", { ing }))
    .catch(err => {
      console.error(err);
      res.send(`Error in /kitchen/${req.params.ingId} GET -- check the terminal.`);
    })
});

router.delete("/:ingId", (req, res) => {
  Ingredient.findByIdAndRemove(req.params.ingId)
    .then(() => res.redirect("/kitchen"))
    .catch(err => {
      console.error(err);
      res.send(`Error in /kitchen/${req.params.ingId} DELETE -- check the terminal.`);
    });
});

// ========== Exports ==========
module.exports = router;