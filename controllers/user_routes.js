// ========== Imports ==========
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/user.js");

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
  
  User.findById(req.session.userId)
    .then(user => {
      user.prefname = newPrefs.prefname;
      user.settings.darkmode = newPrefs.darkmode;
      user.settings.autoshift = newPrefs.autoshift;
      user.save();

      res.redirect("/");
    })
    .catch(err => {
      console.error(err);
      res.send("Error saving user settings -- check terminal.");
    });
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