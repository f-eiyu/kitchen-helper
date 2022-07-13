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
  firstname: {
    type: String
  },
  ingredients: {
    type: [Schema.Types.ObjectId],
    default: []
  },
  recipes: {
    type: [Schema.Types.ObjectId],
    default: []
  },
  shoppingList: {
    type: [Schema.Types.ObjectId],
    default: []
  }
});

const User = model("User", userSchema);

// ========== Exports ==========
module.exports = User;