// ========== Imports ==========
require("dotenv").config();
const { default: mongoose } = require("mongoose");

// ========== Database connection ==========
const DATABASE_URI = process.env.DATABASE_URI;
const CONFIG = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
mongoose.connect(DATABASE_URI, CONFIG);

mongoose.connection
  .on("open", () => console.log("Connected to Mongoose"))
  .on("close", () => console.log("Disconnected from Mongoose"))
  .on("error", err => console.error("Error in Mongoose connection:", err));

// ========== Exports ==========
module.exports = mongoose;