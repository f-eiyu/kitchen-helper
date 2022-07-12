// ========== Imports ==========
const mongoose = require("./connection.js");
const Ingredient = require("./ingredient.js");

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
    console.log("This functionality is not yet implemented.");
  },

  seedAll() {{
    this.seedIngredients();
    this.seedRecipes();
    this.seedShoppingList();
  }}
};

// ========== Exports ==========
module.exports = seed;