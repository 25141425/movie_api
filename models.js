const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean
});

let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: Date,
  FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: "Movie"}]
});

/**
 * Hashes the given password using bcrypt.
 * 
 * @param {string} password - The password to hash.
 * @returns {string} The hashed password.
 */
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 * Validates a given password by comparing it to the hashed password stored in the user document.
 * 
 * @param {string} password - The password to compare with the stored hashed password.
 * @returns {boolean} True if the password matches the stored hashed password, otherwise false.
 */
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};

// Models for Movie and User
let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

// Exporting the models for use in other parts of the application
module.exports.Movie = Movie;
module.exports.User = User;