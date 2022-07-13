// ========== Imports ==========
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');

const kitchenRoutes = require("./controllers/kitchen_routes.js");

const app = require("liquid-express-views")(express());

// ========== Middleware ==========

app.use(morgan('tiny'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: false }))
// to serve files from public statically
app.use(express.static('public'))

// ========== Routes ==========
app.use("/kitchen", kitchenRoutes);

// temporary routes, to be reorganized later
app.get("/", (req, res) => {
  res.render("./home/index.liquid");
});

app.get("/recipes", (req, res) => {
  res.render("./recipes/index.liquid");
});

app.get("/shopping-list", (req, res) => {
  res.render("./shopping-list/index.liquid");
});

const seed = require("./models/seed.js");
app.get("/seed/ingredients", (req, res) => {
  seed.seedIngredients();
  res.send("seeded ingredients db<br /><br /><a href='/'>home</a>");
});

app.get("/seed/shoplist", (req, res) => {
  seed.seedShoppingList();
  res.send("seeded shopping list db<br /><br /><a href='/'>home</a>");
});

// app.get("*", (req, res) => {
//   res.redirect("/");
// });

// ========== Start server ==========
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}.`);
});