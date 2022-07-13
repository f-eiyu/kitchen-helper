// ========== Imports ==========
const mongoose = require("./connection.js");
const Ingredient = require("./ingredient.js");
const ShopListItem = require("./listitem.js");
const Recipe = require("./recipe.js");

// ========== Seed data ==========
// const db = mongoose.connection;
const seed = {
  seedIngredients() {
    const ingredientSeed = [
      {
        name: "Apple",
        amount: 5,
        tags: ["mediocre", "red"],
        favorite: false
      }, {
        name: "Banana",
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
          });
      });
  },

  seedRecipes() {
    const recipeSeed = [
      {
        name: "Cinnamon Challenge",
        ingredientList: [
          {name: "cinnamon", amount: 20},
          {name: "water", amount: 250}
        ],
        instructions: "Put all the cinnamon in your mouth and swallow. Drink water if necessary.",
        tags: ["1/10 would not cinnamon again", "social media is awful"]
      },
      {
        name: "Seed Smoothie",
        ingredientList: [
          {name: "apple", amount: 1},
          {name: "banana", amount: 1},
          {name: "coconut milk", amount: 50},
          {name: "cottage cheese", amount: 0.1}
        ],
        instructions: "Put all ingredients in a blender and mix. Serve chilled. Regret life choices.",
        tags: ["making seed data is too much responsibility for me", "why did i do this"],
        favorite: true
      }
    ];

    Recipe.deleteMany({})
      .then(deleted => {
        console.log("Dropped previous entries:", deleted);
        Recipe.create(recipeSeed)
          .then(recipe => {
            console.log(recipe);
            // db.close();
          })
          .catch(err => {
            console.log("Error seeding recipes:", err);
            // db.close();
          });
      });
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
          });
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