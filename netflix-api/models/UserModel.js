

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: 
  { type: String,
    required: true, 
    unique: true,
     max: 50
     }, 

  likedMovies: { type: Array, default: [] },
});

module.exports = mongoose.model("User", UserSchema);