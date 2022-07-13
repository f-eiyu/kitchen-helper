// ========== Imports ==========
const mongoose = require("./connection.js");

// ========== Schema and model creation ==========
const {Schema, model} = mongoose;

const shopListSchema = new Schema({
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
  checked: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const ShopListItem = model("ShopListItem", shopListSchema);

// ========== Exports ==========
module.exports = ShopListItem;