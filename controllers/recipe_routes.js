// ========== Imports ==========
const express = require("express");
const router = express.Router();

const Ingredient = require("../models/ingredient.js");
const Recipe = require("../models/recipe.js");
const ShopList = require("../models/listitem.js");
const User = require("../models/user.js");

// ========== Utilities ==========
// creates a relationship between each ingredient of a recipe and the matching
// ingredient in the user's kitchen, if the kitchen has it.
const linkIngredients = async (ingredientList) => {
  await Promise.all(ingredientList.map(async recipeIng => {
    const ingRef = await Ingredient.find({name: recipeIng.name});
    if (ingRef.length) { recipeIng.ingRef = ingRef[0]._id; }
    else { recipeIng.ingRef = null; }
  }));
}

// cleans up the raw input provided by req.body
const parseRecipeInput = async (toParse) => {
  const ingredientList = [];
  toParse.ingredients.forEach((ing, i) => {
    if (!ing) { return; }
    ingredientList.push({
      name: ing,
      amount: toParse.amounts[i]
    });
  });
  await linkIngredients(ingredientList);

  const favorite = (toParse.favorite === "on");

  let tags;
  if (toParse.tags.length) {
    tags = toParse.tags.split(",").map(tag => tag.trim());
  } else { tags = []; }

  let notes;
  if (toParse.notes.length) {
    notes = toParse.notes.split(",").map(note => note.trim());
  } else { notes = []; }

  const parsedIng = {
    name: toParse.name,
    ingredientList,
    instructions: toParse.instructions,
    favorite,
    tags,
    notes
  };
  return parsedIng;
}

const sanitizeRegex = (str) => {
  return new RegExp(str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i");
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
router.post("/", async (req, res) => {
  const newRecipe = await parseRecipeInput(req.body);
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

// Filter
router.get("/filter", async (req, res) => {
  // first, find all recipes and ingredients for the user
  const recipeList = await Recipe.find(
    {"owner": req.session.userId},
    {"name": 1, "ingredientList": 1}
  );

  const filteredRecipes = [];
  for (let recipe of recipeList) {
    let includeThisRecipe = true;
    for (let thisRecipeIng of recipe.ingredientList) {
      const thisKitchenIng = await Ingredient.findById(thisRecipeIng.ingRef);
      // exclude if the ingredient is not in the user's kitchen
      if (!thisKitchenIng) { 
        includeThisRecipe = false;
        break;
      }
      // exclude if the user's kitchen does not have enough of this ingredient
      if (thisKitchenIng.amount < thisRecipeIng.amount) {
        includeThisRecipe = false;
        break;
      }
     }

     // include if all ingredients have passed their checks
     if (includeThisRecipe) { filteredRecipes.push(recipe); }
  }

  res.render("./recipes/results.liquid", {
    recipes: filteredRecipes,
    quickFilter: true
  });
});

// Search
router.get("/search", (req, res) => {
  res.render("./recipes/search.liquid");
});

router.post("/search", async (req, res) => {
  const body = req.body;
  const searchParams = {};

  // we use if statements here to explicitly not set the search parameters
  // unless they are being searched for. this is particularly relevant for the
  // name search, which would default to an extremely slow empty regex if not
  // handled this way.
  if (body.name !== "") {
    searchParams.name = {$regex: sanitizeRegex(body.name)};
  }
  if (body.ingredients !== "") {
    let rawIngs = body.ingredients.split(",");
    rawIngs = rawIngs.map(ing => ing.trim()).filter(ing => ing !== "");

    searchParams["ingredientList.name"] = {$all: rawIngs};
  }
  if (body.tags !== "") {
    const rawTags = body.tags.split(",");
    searchParams.tags = {$all: rawTags.map(tag => tag.trim())};
  }
  if (body.favorite === "on") {
    searchParams.favorite = true;
  }

  // now, go and find the desired recipes!
  const searchResults = await Recipe.find(searchParams);
  res.render("./recipes/results.liquid", {
    recipes: searchResults,
    quickFilter: false
  });
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

// Make recipe -- deducts ingredients from user's kitchen. should maybe be put?
router.get("/:recipeId/make", async (req, res) => {
  const recipe = await Recipe.findById(req.params.recipeId);
  const recipeIngs = recipe.ingredientList;

  for (let thisRecipeIng of recipeIngs) {
    const thisUserIng = await Ingredient.findById(thisRecipeIng.ingRef);
    if (thisUserIng) {
      thisUserIng.amount = Math.max(thisUserIng.amount - thisRecipeIng.amount, 0);
      thisUserIng.save();
    }
  }

  res.redirect("/recipes");
});

// Transfer -- adds missing/insufficient ingredients to user's shopping list
router.get("/:recipeId/transfer", async (req, res) => {
  const recipe = await Recipe.findById(req.params.recipeId);
  const recipeIngs = recipe.ingredientList;

  const toTransfer = []; // {name, amount}
  for (let thisRecipeIng of recipeIngs) {
    const thisUserIng = await Ingredient.findById(thisRecipeIng.ingRef);
    if (thisUserIng) {
      // if the user has the ingredient only transfer the difference
      // ## TODO: keep track of amount in shopping list as well
      const ingDiff = thisRecipeIng.amount - thisUserIng.amount;
      if (ingDiff > 0) {
        toTransfer.push({
          name: thisRecipeIng.name,
          amount: ingDiff,
          owner: req.session.userId
        });
      }
    } else { // always transfer completely if user doesn't have the ingredient
      toTransfer.push({
        name: thisRecipeIng.name,
        amount: thisRecipeIng.amount,
        owner: req.session.userId
      });
    }
  }

  // finally, upsert the appropriate items to the shopping list
  for (let ing of toTransfer) {
    const thisTransfer = await ShopList.findOneAndUpdate(
      {
        name: ing.name,
        owner: req.session.userId
      },
      {
        $inc: {"amount": ing.amount}
      },
      {
        new: true,
        upsert: true
      }
    );
  }
  res.redirect(`/recipes/${req.params.recipeId}`);
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