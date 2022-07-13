// ========== Imports ==========
const express = require("express");
const router = express.Router();
const ShopList = require("../models/listitem.js");

// ========== Routes ==========
// the shopping list does not need a SHOW route, because there's little enough
// information that it will all just be displayed on the list.

// Index
router.get("/", (req, res) => {
  ShopList.find({})
    .then(list => res.render("./shoplist/index.liquid", { shoplist: list }))
    .catch(err => {
      console.error(err);
      res.send("Error in /shoplist GET -- check the terminal.");
    });
});

// New
router.get("/new", (req, res) => {
  res.render("./shoplist/new.liquid");
});

// Create
router.post("/", (req, res) => {
  ShopList.create(req.body)
    .then(item => {
      console.log(`Created shopping list item "${item.name}".`);
      res.redirect("/shoplist");
    })
    .catch(err => {
      console.error(err);
      res.send(`Error in /shoplist CREATE -- check the terminal.`);
    });
})

// Edit
router.get("/:itemId/edit", (req, res) => {
  ShopList.findById(req.params.itemId)
    .then(item => {
      res.render("./shoplist/edit.liquid", { item });
    })
    .catch(err => {
      console.error(err);
      res.send(`Error in /shoplist/${req.params.itemId} EDIT -- check the terminal.`);
    });
});

// Create
router.put("/:itemId", (req, res) => {
  const { itemId } = req.params;
  ShopList.findByIdAndUpdate(itemId, req.body,
    {
      new: true,
      runValidators: true
    })
    .then(item => res.redirect(`/shoplist`))
    .catch(err => {
      console.error(err);
      res.send(`Error in /shoplist/${itemId} CREATE -- check the terminal.`);
    });
});

// Delete
router.delete("/:itemId", (req, res) => {
  ShopList.findByIdAndDelete(req.params.itemId)
    .then(() => res.redirect("/shoplist"))
    .catch(err => {
      console.error(err);
      res.send(`Error in /shoplist/${req.params.itemId} DELETE -- check the terminal.`);
    });
});

// ========== Exports ==========
module.exports = router;