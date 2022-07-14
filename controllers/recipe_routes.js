// ========== Imports ==========
const express = require("express");
const router = express.Router();

const Recipe = require("../models/recipe.js");
const User = require("../models/user.js");

// ========== Utilities ==========
const parseRecipeInput = (toParse) => {
  console.log(toParse);

  const ingredientList = [];
  toParse.ingredients.forEach((ing, i) => {
    ingredientList.push({
      name: ing,
      amount: toParse.amounts[i]
    });
  });

  const favorite = (toParse.favorite === "on");

  let tags;
  if (toParse.tags.length) {
    tags = toParse.tags.split(",").map(tag => tag.trim());
  } else { tags = []; }

  let notes;
  if (toParse.notes.length) {
    notes = toParse.notes.split(",").map(note => note.trim());
  } else { notes = []; }

  return {
    name: toParse.name,
    ingredientList,
    instructions: toParse.instructions,
    favorite,
    tags,
    notes
  };
}

// ========== Routes ==========
// Index
router.get("/", (req, res) => {
  // only retrieve recipes belonging to the current user
  User.findById(req.session.userId)
  .then(user => user.recipes)
  .then(recipeIds => {
    Recipe.find({"_id": {$in: recipeIds} })
      .sort({"updatedAt": -1})
      .then(recipes => res.render("./recipes/index.liquid", { recipes }));
  })
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
  const newRecipe = parseRecipeInput(req.body);
  newRecipe.owner = req.session.userId;

  Recipe.create(newRecipe)
    .then(recipe => {
      User.findById(newRecipe.owner)
        .then(user => {
          user.recipes.push(recipe);
          user.save();
          console.log(`Created recipe "${recipe.name}" for user "${user.username}."`);

          res.redirect("/recipes");
        })
        .catch(err => {
          console.error(err);
          res.send(`Error in /recipe CREATE user update -- check the terminal.`);
        });
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
      res.send(`Error in /recipes/${req.params.recipeId} SHOW -- check the terminal.`);
    });
});

// Edit
router.get("/:recipeId/edit", (req, res) => {
  Recipe.findById(req.params.recipeId)
    .then(recipe => {
      const tagStr = recipe.tags.join(", ");
      const noteStr = recipe.notes.join(", ");
      res.render("./recipes/edit.liquid", { recipe, tagStr, noteStr });
    })
    .catch(err => {
      console.error(err);
      res.send(`Error in /recipes/${req.params.recipeId} EDIT -- check the terminal.`);
    });
});

// Update
router.put("/:recipeId", (req, res) => {
  const updatedRecipe = parseRecipeInput(req.body);

  Recipe.findByIdAndUpdate(req.params.recipeId, updatedRecipe,
    {
      new: true,
      runValidators: true
    })
    .then(recipe => res.redirect(`/recipes/${req.params.recipeId}`))
    .catch(err => {
      console.error(err);
      res.send(`Error in /recipes/${req.params.recipeId} UPDATE -- check the terminal.`);
    });
});

// Delete
router.delete("/:recipeId", async (req, res) => {
  const toDel = await Recipe.findById(req.params.recipeId);
  const user = await User.findById(req.session.userId);

  if (user._id.equals(toDel.owner)) {
    // first remove recipe from user
    const recipeIndex = user.recipes.indexOf(toDel._id);
    if (recipeIndex !== -1) {
      user.recipes.splice(recipeIndex, 1);
      user.save();
    }
    // then, delete recipe from the database
    console.log(`Deleting recipe "${toDel.name}" for user ${user.username}.`)
    await toDel.delete();

    res.redirect("/recipes");
  } else {
    res.send("user mismatch")
  }
});

// ========== Exports ==========
module.exports = router;