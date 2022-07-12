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

app.get("/", (req, res) => {
  res.send("hello app!");
})

app.get("*", (req, res) => {
  res.redirect("/");
})

// ========== Start server ==========
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}.`);
})