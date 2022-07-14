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
    type: [{"name": String, "amount": Number}],
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
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true
});

const Recipe = model("Recipe", recipeSchema);

// ========== Exports ==========
module.exports = Recipe;