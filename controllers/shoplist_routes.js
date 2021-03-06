// ========== Imports ==========
const express = require("express");
const router = express.Router();

const Ingredient = require("../models/ingredient.js");
const ShopList = require("../models/listitem.js");
const User = require("../models/user.js");

// ========== Routes ==========
// the shopping list does not need a SHOW route, because there's little enough
// information that it will all just be displayed on the list.

// Index
router.get("/", async (req, res) => {
  // only retrieve shopping list items belonging to the current user
  const thisShopList = await ShopList.find({owner: req.session.userId});
  const thisUser = await User.findById(req.session.userId);
  
  // sort checked items to the bottom of the shopping list, if applicable
  if (thisUser.settings.autoshift) {
    // not the most efficient solution, but easy to write.
    
    // first, enumerate all unchecked items.
    const theseUnchecked = thisShopList.filter(item => !item.checked);
    // then, enumerate all checked items and sort in reverse chronological order
    const theseChecked = thisShopList.filter(item => item.checked);
    theseChecked.sort((item1, item2) => {
      return item2.updatedAt - item1.updatedAt;
    })

    // clear thisShopList and rebuild it with the correctly ordered list
    thisShopList.splice(0, thisShopList.length);
    thisShopList.push(...theseUnchecked);
    thisShopList.push(...theseChecked);
    res.locals.checkedCount = theseChecked.length;
  }

  res.render("./shoplist/index.liquid", { shoplist: thisShopList });
});

// New
router.get("/new", (req, res) => {
  res.render("./shoplist/new.liquid");
});

// Create
router.post("/", (req, res) => {
  req.body.owner = req.session.userId;

  ShopList.create(req.body)
    .then(item => {
      User.findById(req.body.owner)
        .then(user => {
          user.shoppingList.push(item);
          user.save();
          console.log(`Created shopping list item "${item.name}" for user "${user.username}".`)

          res.redirect("/shoplist");
        })
        .catch(err => {
          console.error(err);
          res.send(`Error in /shoplist CREATE user update -- check the terminal.`);
        });
    })
    .catch(err => {
      console.error(err);
      res.send(`Error in /shoplist CREATE -- check the terminal.`);
    });
})

// Item checked/unchecked
router.put("/", async (req, res) => {
  const itemId = Object.keys(req.body)[0];
  const check = (req.body[itemId] === "on");

  ShopList.findById(itemId)
    .then(item => {
      item.checked = check;
      item.save();
    })
    .then(res.redirect("/shoplist"));
});

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

// Update
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

// Transfer item from "Buy More" button in kitchen
router.post("/transfer-ingredient", async (req, res) => {
  req.body.owner = req.session.userId;

  // upsert the specified ingredient
  ShopList.findOneAndUpdate(
    {
      name: req.body.name,
      owner: req.body.owner
    },
    {
      $inc: {"amount": req.body.amount}
    },
    {
      new: true,
      upsert: true,
      rawResult: true
    }
  )
  // update User's shopping list if necessary
    .then(async updatedItem => {
      if (!updatedItem.lastErrorObject.updatedExisting) {
        await User.findById(req.session.userId)
          .then(user => {
            user.shoppingList.push(updatedItem.value._id);
            user.save();
          });
      }
    })
    .then(() => {
      res.redirect("/kitchen")})
    .catch(err => {
      console.error(err);
      res.send(`Error in /shoplist/transfer -- check the terminal.`);
    });
});

router.post("/transfer-list", (req, res) => {
  ShopList.find({"_id": {$in: req.body.checkedIds}})
    .then(items => {
      for (let item of items) {
        // update amount of each ingredient, upserting if necessary
        Ingredient.findOneAndUpdate(
          {
            name: item.name,
            owner: req.session.userId
          },
          {
            $inc: {"amount": item.amount}
          },
          {
            new: true,
            upsert: true,
            rawResult: true
          }
        )
          .then(async updateData => {
            const updatedItem = await Ingredient.findOne(updateData.value);
            updatedItem.save(); // to trigger updateRecipeIngRefs() middleware
            
            return updateData;
          })
          .then(updateData => {
            // remove this item from user's shopping list
            const update = {
              $pull: {shoppingList: item._id}
            };
            // upsert this item to the user's ingredient list, if applicable
            if (!updateData.lastErrorObject.updatedExisting) {
              update["$push"] = {ingredients: updateData.value._id}
            }

            User.findByIdAndUpdate(
              req.session.userId,
              update,
              {
                new: true,
                upsert: false
              }
            ).exec();
          })
          // finally, purge this item from the database completely
          .then(() => item.delete());
      }
    })
    .then(() => {
      res.redirect("/shoplist");
    })
    .catch(err => {
      console.error(err);
      res.send(`Error in /shoplist/transfer-list -- check the terminal.`);
    });
});

// Delete
router.delete("/:itemId", async (req, res) => {
  const toDel = await ShopList.findById(req.params.itemId);
  const user = await User.findById(req.session.userId);

  if (user._id.equals(toDel.owner)) {
    // first remove item from user
    const shopListIndex = user.shoppingList.indexOf(toDel._id);
    if (shopListIndex !== -1) {
      user.shoppingList.splice(shopListIndex, 1);
      user.save();
    }
    // then, delete recipe from the database
    console.log(`Deleting shopping list item "${toDel.name}" for user ${user.username}.`)
    await toDel.delete();

    res.redirect("/shoplist");
  } else {
    res.send("user mismatch")
  }
});

// ========== Exports ==========
module.exports = router;