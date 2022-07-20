const Ingredient = require("../models/ingredient.js");

// creates a relationship between each ingredient of a recipe and the 
// matching ingredient in the user's kitchen, if it exists; if not,
// sets the relationship to "null".
const linkIngredients = async (ingredientList) => {
  await Promise.all(ingredientList.map(async recipeIng => {
    const ingRef = await Ingredient.find({name: recipeIng.name});
    if (ingRef.length) { recipeIng.ingRef = ingRef[0]._id; }
    else { recipeIng.ingRef = null; }
  }));
}

module.exports = linkIngredients;