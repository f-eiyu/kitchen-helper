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

// New
router.get("/new", (req, res) => {
  res.render("./kitchen/new.liquid");
});

// Create
router.post("/", (req, res) => {
  const tagArray = req.body.tags.split(",").map(tag => tag.trim());
  const favorite = (req.body.favorite === "on");

  req.body.tags = tagArray;
  req.body.favorite = favorite;

  Ingredient.create(req.body)
    .then(ing => {
      console.log(`Created ingredient "${ing.name}".`)
      res.redirect("/kitchen");
    })
    .catch(err => {
      console.error(err);
      res.send(`Error in /kitchen CREATE -- check the terminal.`);
    });
});

// Show
router.get("/:ingId", (req, res) => {
  Ingredient.findById(req.params.ingId)
    .then(ing => res.render("./kitchen/show.liquid", { ing }))
    .catch(err => {
      console.error(err);
      res.send(`Error in /kitchen/${req.params.ingId} GET -- check the terminal.`);
    });
});

// Edit
router.get("/:ingId/edit", (req, res) => {
  Ingredient.findById(req.params.ingId)
    .then(ing => {
      const tagStr = ing.tags.join(", ");
      res.render("./kitchen/edit.liquid", { ing, tagStr });
    })
    .catch(err => {
      console.error(err);
      res.send(`Error in /kitchen/${req.params.ingId} EDIT -- check the terminal.`);
    });
});

// Update
router.put("/:id", (req, res) => {
  const tagArray = req.body.tags.split(",").map(tag => tag.trim());
  const favorite = (req.body.favorite === "on");

  req.body.tags = tagArray;
  req.body.favorite = favorite;

  Ingredient.findByIdAndUpdate(req.params.id, req.body,
    {
      new: true,
      runValidators: true
    })
    .then(ing => res.redirect(`/kitchen/${req.params.id}`))
    .catch(err => {
      console.error(err);
      res.send(`Error in /kitchen/${req.params.ingId} EDIT -- check the terminal.`);
    });
});

// Delete
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