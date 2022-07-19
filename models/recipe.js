// ========== Imports ==========
const mongoose = require("./connection.js");

// ========== Create recipe schema and model ==========
const { Schema, model } = mongoose;

const recipeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  ingredientList: {
    type: [{
      "name": {
        type: String,
        required: true
      },
      "amount": Number,
      "ingRef": {
        type: Schema.Types.ObjectId,
        ref: "Ingredient",
      }
    }],
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