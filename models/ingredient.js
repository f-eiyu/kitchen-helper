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
    type: Number,
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
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true
});

const Ingredient = model("Ingredient", ingredientSchema);

// ========== Exports ==========
module.exports = Ingredient;