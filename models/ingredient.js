// ========== Imports ==========
const mongoose = require("./connection.js");

// ========== Schema and model creation ==========
const {Schema, model} = mongoose;

const ingredientSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  amount: {
    type: String,
    required: true,
    min: 0
  },
  tags: {
    type: [String],
    default: []
  },
  favorite: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Ingredient = model("Ingredient", ingredientSchema);

// ========== Exports ==========
module.exports = Ingredient;