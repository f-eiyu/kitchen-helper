// ========== Imports ==========
const express = require("express");
const router = express.Router();
const Ingredient = require("../models/ingredient.js");
const User = require("../models/user.js");

// ========== Routes ==========
// Index
router.get("/", (req, res) => {
  // only retrieve ingredients belonging to the current user
  User.findById(req.session.userId)
  .then(user => user.ingredients)
  .then(ingIds => {
    Ingredient.find({"_id": {$in: ingIds} })
      .sort({"updatedAt": -1})
      .then(ings => res.render("./kitchen/index.liquid", { ings }));
  })
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
  req.body.owner = req.session.userId;

  Ingredient.create(req.body)
    .then(ing => {
      User.findById(req.body.owner)
        .then(user => {
          user.ingredients.push(ing);
          user.save();
          console.log(`Created ingredient "${ing.name}" for user "${user.username}".`)

          res.redirect("/kitchen");
        })
        .catch(err => {
          console.error(err);
          res.send(`Error in /kitchen CREATE user update -- check the terminal.`);
        });
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
router.delete("/:ingId", async (req, res) => {
  const toDel = await Ingredient.findById(req.params.ingId);
  const user = await User.findById(req.session.userId);

  if (user._id.equals(toDel.owner)) {
    // first remove ingredient from user
    const ingIndex = user.ingredients.indexOf(toDel._id);
    if (ingIndex !== -1) {
      user.ingredients.splice(ingIndex, 1);
      user.save();
    }
    // then, delete recipe from the database
    console.log(`Deleting ingredient "${toDel.name}" for user ${user.username}.`)
    await toDel.delete();

    res.redirect("/kitchen");
  } else {
    res.send("user mismatch")
  }
});

// ========== Exports ==========
module.exports = router;