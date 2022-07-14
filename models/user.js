// ========== Imports ==========
const mongoose = require("./connection.js");

// ========== Create user schema and model ==========
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  prefname: {
    type: String
  },
  ingredients: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: "Ingredient"
    }],
    default: []
  },
  recipes: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: "Recipe"
    }],
    default: []
  },
  shoppingList: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: "ShopListItem"
    }],
    default: []
  },
  darkmode: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const User = model("User", userSchema);

// ========== Exports ==========
module.exports = User;