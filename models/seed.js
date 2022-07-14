// ========== Imports ==========
const Ingredient = require("./ingredient.js");
const ShopListItem = require("./listitem.js");
const Recipe = require("./recipe.js");
const User = require("./user.js");

// ========== Seed data ==========
const seed = {
  async seedIngredients(req, res) {
    console.log(Ingredient.name);
    const ingredientSeed = [
      {
        name: "Apple",
        amount: 5,
        tags: ["mediocre", "red"],
        favorite: false,
        owner: req.session.userId
        
      }, {
        name: "Banana",
        amount: 12,
        tags: ["only good when green"],
        favorite: false,
        owner: req.session.userId
      }, {
        name: "Coconut milk",
        amount: 250,
        tags: ["yummy"],
        favorite: true,
        owner: req.session.userId
      }, {
        name: "Cottage cheese",
        amount: 1,
        tags: ["don't buy again", "awful"],
        favorite: false,
        owner: req.session.userId
      }
    ];

    // purge all ingredients associated with the current user
    await Ingredient.deleteMany({owner: req.session.userId})
      .then(deleted => {
        console.log("Dropped previous entries:", deleted);
      })
      // seed database
      .then(async () => {
        await Ingredient.create(ingredientSeed)
          .then(async ings => {
            // purge user's previous ingredients and seed with new ones
            await User.findById(req.session.userId)
              .then(user => {
                user.ingredients = new Array(...ings);
                user.save();
                console.log(ings);
              })
          })
      })
      .catch(err => {
        console.log("Error seeding ingredients:", err);
      });
  },

  async seedRecipes(req, res) {
    const recipeSeed = [
      {
        name: "Cinnamon Challenge",
        ingredientList: [
          {name: "cinnamon", amount: 20},
          {name: "water", amount: 250}
        ],
        instructions: "Put all the cinnamon in your mouth and swallow. Drink water if necessary.",
        tags: ["1/10 would not cinnamon again", "social media is awful"],
        owner: req.session.userId
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
        favorite: true,
        owner: req.session.userId
      }
    ];

    // purge all ingredients associated with the current user
    await Recipe.deleteMany({owner: req.session.userId})
      .then(deleted => {
        console.log("Dropped previous entries:", deleted);
      })
      // seed database
      .then(async () => {
        await Recipe.create(recipeSeed)
          .then(async recipes => {
            // purge user's previous ingredients and seed with new ones
            await User.findById(req.session.userId)
              .then(user => {
                user.recipes = new Array(...recipes);
                user.save();
                console.log(recipes);
              })
          })
      })
      .catch(err => { 
        console.log("Error seeding recipes:", err);
      });
  },

  async seedShoppingList(req, res) {
    const shopListSeed = [
      {
        name: "water",
        amount: 30,
        owner: req.session.userId
      }, {
        name: "sugar",
        amount: 100,
        owner: req.session.userId
      }, {
        name: "cinnamon",
        amount: 1,
        owner: req.session.userId
      }, {
        name: "tide pods",
        amount: 120,
        owner: req.session.userId
      }
    ];

    // purge all shopping list items associated with the current user
    await ShopListItem.deleteMany({owner: req.session.userId})
      .then(deleted => {
        console.log("Dropped previous entries:", deleted);
      })
      // seed database
      .then(async () => {
        await ShopListItem.create(shopListSeed)
          .then(async items => {
            // purge user's previous ingredients and seed with new ones
            await User.findById(req.session.userId)
              .then(user => {
                user.shoppingList = new Array(...items);
                user.save();
                console.log(items);
              })
          })
      })
      .catch(err => { 
        console.log("Error seeding shopping list:", err);
      }); // try wrapping in Promise with a .finally(return resolve()) here?
  },

  async seedAll(req, res) {
    await this.seedIngredients(req, res);
    await this.seedRecipes(req, res);
    await this.seedShoppingList(req, res);
  }
};

// ========== Exports ==========
module.exports = seed;