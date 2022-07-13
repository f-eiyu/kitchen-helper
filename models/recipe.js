// ========== Imports ==========
const mongoose = require("./connection.js");

// ========== Create recipe schema and model ==========
const { Schema, model } = mongoose;

const recipeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  ingredientList: {
    type: [{String: Number}],
     required: true
  },
  instructions: {
    type: String,
    default: ""
  },
  favorite: {
    type: Boolean,
    default: false
  },
  tags: {
    type: [String],
    default: []
  },
  notes: { // update to sub-doc later
    type: [String],
    default: []
  }
});

const Recipe = model("Recipe", recipeSchema);

// ========== Exports ==========
module.exports = Recipe;