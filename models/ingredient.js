// ========== Imports ==========
const mongoose = require("./connection.js");
const Recipe = require("../models/recipe.js");

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

// ========== Middleware ==========
async function updateRecipeIngRefs() {
  const recipesWithIng = await Recipe.find({"ingredientList.name": this.name});
  recipesWithIng.forEach(recipe => {
    const matchingIng = recipe.ingredientList.find(ing => ing.name === this.name);
    matchingIng.ingRef = this._id;
    recipe.save();
  })
}

ingredientSchema.pre("save", updateRecipeIngRefs);


// ========== Model creation ==========
const Ingredient = model("Ingredient", ingredientSchema);

// ========== Exports ==========
module.exports = Ingredient;