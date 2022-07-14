// ========== Imports ==========
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const session = require("express-session");
const MongoStore = require("connect-mongo");

const checkDarkMode = require("./middleware/darkmode.js");
const checkLoggedIn = require("./middleware/loggedin.js");

const kitchenRoutes = require("./controllers/kitchen_routes.js");
const recipeRoutes = require("./controllers/recipe_routes.js");
const shopListRoutes = require("./controllers/shoplist_routes.js");
const userRoutes = require("./controllers/user_routes.js");

const app = require("liquid-express-views")(express());

// ========== Middleware ==========

// app.use(morgan('tiny'));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(
  session({
    secret: process.env.SECRET,
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URI
    }),
    saveUninitialized: true,
    resave: false
  })
);

// custom middleware
app.use(checkDarkMode);
app.use(checkLoggedIn);

// ========== Routes ==========
app.use("/kitchen", kitchenRoutes);
app.use("/recipes", recipeRoutes);
app.use("/shoplist", shopListRoutes);
app.use("/account", userRoutes);

// temporary routes, to be reorganized later
app.get("/", (req, res) => {
  res.render("./home/index.liquid");
});

app.get("/recipes", (req, res) => {
  res.render("./recipes/index.liquid");
});

const seed = require("./models/seed.js");
app.get("/seed/ingredients", (req, res) => {
  seed.seedIngredients();
  res.send("seeded ingredients db<br /><br /><a href='/'>home</a>");
});

app.get("/seed/recipes", (req, res) => {
  seed.seedRecipes();
  res.send("seeded recipes db<br /><br /><a href='/'>home</a>")
});

app.get("/seed/shoplist", (req, res) => {
  seed.seedShoppingList();
  res.send("seeded shopping list db<br /><br /><a href='/'>home</a>");
});

app.get("/seed", (req, res) => {
  seed.seedAll();
  res.send("all dbs seeded<br /><br /><a href='/'>home</a>");
});

app.get("*", (req, res) => {
  const { originalUrl } = req;
  console.log(originalUrl, "not found. Redirecting to home.");
  res.redirect("/");
});

// ========== Start server ==========
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}.`);
});