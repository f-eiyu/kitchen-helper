// ========== Imports ==========
const express = require("express");
const User = require("../models/user.js");
const bcrypt = require("bcryptjs");

const router = express.Router();

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
    .then(user => res.redirect("/account/login"))
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
        console.log(req.session);
        res.redirect("/");
      } else {
        res.send("Username or password incorrect.");
      }
    })
});

// ========== Exports ==========
module.exports = router;