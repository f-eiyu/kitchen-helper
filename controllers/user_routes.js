// ========== Imports ==========
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const fetch = require("node-fetch");
require("dotenv").config();

const User = require("../models/user.js");
const Recipe = require("../models/recipe.js");

const linkIngredients = require("../utils/link-ingredients.js");

// ========== Routes ==========
// New
router.get("/create-account", (req, res) => {
  res.render("./account/new.liquid");
});

// Create
router.post("/create-account", async (req, res) => {
  // salt and encrypt password
  req.body.password = await bcrypt.hash(
    req.body.password,
    await bcrypt.genSalt(10)
  );

  // create user
  User.create(req.body)
    .then(user => {
      console.log(`Creating user "${user.username}" (${user._id}) at ${new Date()}.`);
      res.redirect("/account/login");
    })
    .catch(err => {
      console.error(err);
      res.send(`Error creating user "${req.body.username}" -- check the terminal.`);
    });
});

// Login page
router.get("/login", (req, res) => {
  res.render("./account/login.liquid");
});

// Authenticate login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  User.findOne({username})
    .then(async (user) => {
      const userValid = Boolean(user);
      const passwordValid = userValid ?
                            await bcrypt.compare(password, user.password) :
                            false;
      
      const authValid = (userValid && passwordValid);
      if (authValid) {
        req.session.username = username;
        req.session.loggedIn = true;
        req.session.userId = user._id;
        console.log(`Starting session for user "${username}" at ${new Date()}."`);

        res.redirect("/");
      } else {
        res.send("Username or password incorrect.");
      }
    })
});

// Settings
router.get("/settings", (req, res) => {
  User.findById(req.session.userId)
    .then(user => {
      const userSettings = [];
      userSettings.prefname = user.prefname;
      userSettings.darkmode = user.settings.darkmode;
      userSettings.autoshift = user.settings.autoshift;
      userSettings.useMilitaryTime = user.settings.useMilitaryTime;
      res.render("./account/settings.liquid", { userSettings });
    })
    .catch(err => {
      console.error(err);
      res.send("Error loading user settings -- check terminal.");
    });
})

// Save settings
router.put("/save-settings", (req, res) => {
  const newPrefs = req.body;
  newPrefs.darkmode = (req.body.darkmode === "on");
  newPrefs.autoshift = (req.body.autoshift === "on");
  newPrefs.useMilitaryTime = (req.body.timedisp === "24");
  
  User.findById(req.session.userId)
    .then(user => {
      user.prefname = newPrefs.prefname;
      user.settings.darkmode = newPrefs.darkmode;
      user.settings.autoshift = newPrefs.autoshift;
      user.settings.useMilitaryTime = newPrefs.useMilitaryTime;
      user.save();

      res.redirect("/");
    })
    .catch(err => {
      console.error(err);
      res.send("Error saving user settings -- check terminal.");
    });
});

// Seed recipes
router.get("/edamam-seed-recipes", (req, res) => {
  res.render("./account/edamam-confirm.liquid");
});

router.get("/edamam-seed-recipes/seed", async (req, res) => {
  const owner = req.session.userId;

  const getEdamamUrl = (query) => {
    return `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_API_KEY}`;
  }

  const parseEdamamRecipe = async (rawRecipe, query, owner) => {
    const ingredientList = [];
    for (let ingredient of rawRecipe.ingredients) {
      const thisIngredient = {
        name: ingredient.food.toLowerCase(),
        amount: ingredient.quantity
      }
      ingredientList.push(thisIngredient);
    }
    await linkIngredients(ingredientList);

    const parsedRecipe = {
      name: rawRecipe.label,
      description: `A delicious ${query} imported from Edamam, just for you!`,
      ingredientList,
      instructions: `Refer to <a href="${rawRecipe.url}">${rawRecipe.source}</a> for full cooking instructions.`,
      tags: [
        query,
        "imported from Edamam"
      ],
      owner
    };

    return parsedRecipe;
  }

  const seedRecipes = [];

  for (let query of ["breakfast", "lunch", "dinner", "snack", "dessert"]) {
    const apiUrl = getEdamamUrl(query);

    const fetchedRecipesRaw = await fetch(apiUrl);
    const fetchedRecipes = await fetchedRecipesRaw.json();

    for (let rawRecipe of fetchedRecipes.hits) {
      const parsedRecipe = await parseEdamamRecipe(rawRecipe.recipe, query, owner);
      const isNew = ((await Recipe.findOne({
        name: parsedRecipe.name,
        owner,
        tags: "imported from Edamam"
      })) === null);
      if (isNew) { seedRecipes.push(parsedRecipe); }
    }
  }

  await Recipe.create(seedRecipes);
  
  res.redirect("/recipes");
});

// Log out
router.get("/logout", (req, res) => {
  console.log(`Ending session for user "${req.session.username}" at ${new Date()}.`);
  req.session.destroy(sess => {
    res.redirect("/");
  });
});

// ========== Exports ==========
module.exports = router;