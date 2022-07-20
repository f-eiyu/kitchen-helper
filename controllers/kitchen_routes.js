// ========== Imports ==========
const express = require("express");
const router = express.Router();

const Ingredient = require("../models/ingredient.js");
const Recipe = require("../models/recipe.js");
const User = require("../models/user.js");

const sanitizeRegex = require("../utils/sanitize-regex.js");
const parseDate = require("../utils/parse-date.js");


// ========== Utilities ==========
// updates all ingRef fields in ingredientLists of recipes belonging to the
// current user
const updateIngRefs = async (userId, newIng = null, oldIngName = null) => {
  // clear ingRef fields matching the old name, if applicable
  if (oldIngName !== null) {
    await Recipe.updateMany(
      {
        "ingredientList.name": oldIngName,
        owner: userId
      },
      {
        "ingredientList.$.ingRef": null
      },
      {
        new: true,
        upsert: false,
        timestamps: false
      }
    )
  }

  // update ingRef fields matching the new name, if applicable
  if (newIng !== null) {
    await Recipe.updateMany(
      {
        "ingredientList.name": newIng.name,
        owner: userId
      },
      {
        "ingredientList.$.ingRef": newIng._id
      },
      {
        new: true,
        upsert: false,
        timestamps: false
      }
    );
  }
}

// ========== Routes ==========
// Index
router.get("/", async (req, res) => {
  // only retrieve ingredients belonging to the current user
  const user = await User.findById(req.session.userId);
  const { useMilitaryTime } = user.settings;
  const ingList = await Ingredient.find({owner: req.session.userId});

  // sort in reverse alphabetical order
  ingList.sort((ing1, ing2) => (ing2.updatedAt - ing1.updatedAt));
  for (let ing of ingList) {
    ing.renderedDate = parseDate(ing.updatedAt, useMilitaryTime);
  }
  res.render("./kitchen/index.liquid", {ings: ingList});
});

// Search results
router.post("/search", async (req, res) => {
  const rawQuery = sanitizeRegex(req.body.query);
  const user = await User.findById(req.session.userId);
  const { useMilitaryTime } = user.settings;
  
  const parsedQuery = {
    $or: [
      {name: rawQuery},
      {tags: rawQuery}
    ]
  };

  const searchResults = await Ingredient.find(parsedQuery);
  for (let result of searchResults) {
    result.renderedDate = parseDate(result.updatedAt, useMilitaryTime);
  }
  searchResults.sort((res1, res2) => (res2.updatedAt - res1.updatedAt));

  res.render("./kitchen/index.liquid", {
    ings: searchResults,
    useMilitaryTime,
    searchQuery: rawQuery
  });
});

// New
router.get("/new", (req, res) => {
  res.render("./kitchen/new.liquid");
});

// Create
router.post("/", (req, res) => {
  const tagArray = req.body.tags.split(",")
    .map(tag => tag.trim())
    .filter(tag => tag !== "");
  const favorite = (req.body.favorite === "on");

  req.body.tags = tagArray;
  req.body.favorite = favorite;
  req.body.owner = req.session.userId;

  Ingredient.create(req.body)
    .then(ing => {
      User.findById(req.body.owner)
        .then(user => {
          updateIngRefs(user._id, ing);
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
router.get("/:ingId", async (req, res) => {
  const user = await User.findById(req.session.userId);
  const { useMilitaryTime } = user.settings;
  
  Ingredient.findById(req.params.ingId)
    .then(ing => {
      ing.renderedDate = parseDate(ing.updatedAt, useMilitaryTime);
      res.render("./kitchen/show.liquid", { ing })
    })
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
router.put("/:id", async (req, res) => {
  const tagArray = req.body.tags.split(",").map(tag => tag.trim());
  if (tagArray.every(el => el === "")) { req.body.tags = []; }
  else { req.body.tags = tagArray; }

  const favorite = (req.body.favorite === "on");
  req.body.favorite = favorite;

  const oldIngName = (await Ingredient.findById(req.params.id)).name;

  Ingredient.findByIdAndUpdate(req.params.id, req.body,
    {
      new: true,
      runValidators: true
    })
    .then(async ing => {
      console.log(ing.name, oldIngName)
      await updateIngRefs(req.session.userId, ing, oldIngName);
      res.redirect(`/kitchen/${req.params.id}`);
    })
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
    await updateIngRefs(user._id, null, toDel.name);
    await toDel.delete();

    res.redirect("/kitchen");
  } else {
    res.send("user mismatch")
  }
});

// ========== Exports ==========
module.exports = router;