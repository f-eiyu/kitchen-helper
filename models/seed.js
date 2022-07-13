// ========== Imports ==========
const mongoose = require("./connection.js");
const Ingredient = require("./ingredient.js");
const ShopListItem = require("./listitem.js");

// ========== Seed data ==========
const db = mongoose.connection;
const seed = {
  seedIngredients() {
    const ingredientSeed = [
      {
        name: "Apples",
        amount: 5,
        tags: ["mediocre", "red"],
        favorite: false
      }, {
        name: "Bananas",
        amount: 12,
        tags: ["only good when green"],
        favorite: false
      }, {
        name: "Coconut milk",
        amount: 250,
        tags: ["yummy"],
        favorite: true
      }, {
        name: "Cottage cheese",
        amount: 1,
        tags: ["don't buy again", "awful"],
        favorite: false
      }
    ];

    Ingredient.deleteMany({})
      .then(deleted => {
        console.log("Dropped previous entries:", deleted);

        Ingredient.create(ingredientSeed)
          .then(ings => {
            console.log(ings);
            // db.close();
          })
          .catch(err => {
            console.log("Error seeding ingredients:", err);
            // db.close();
          })
      });
  },

  seedRecipes() {
    console.log("This functionality is not yet implemented.");
  },

  seedShoppingList() {
    const shopListSeed = [
      {
        name: "water",
        amount: 30,
      }, {
        name: "sugar",
        amount: 100,
      }, {
        name: "cinnamon",
        amount: 1,
      }, {
        name: "tide pods",
        amount: 120,
      }
    ];

    ShopListItem.deleteMany({})
      .then(deleted => {
        console.log("Dropped previous entries:", deleted);

        ShopListItem.create(shopListSeed)
          .then(item => {
            console.log(item);
            // db.close();
          })
          .catch(err => {
            console.log("Error seeding shopping list:", err);
            // db.close();
          })
      });
  },

  seedAll() {{
    this.seedIngredients();
    this.seedRecipes();
    this.seedShoppingList();
  }}
};

// ========== Exports ==========
module.exports = seed;