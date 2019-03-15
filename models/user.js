// Get the dependence
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// Decription of the user collection.
var UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  name: {
    type: String
  },
  twitchName: {
    type: String
  },
  steamId: {
    type: String
  },
  steamName: {
    type: String
  }
});

// Export the schema to use it in different files.
var User = module.exports = mongoose.model('User', UserSchema);

// Function for manipulate the user collection.
// Create the new user
module.exports.createUser = function(newUser, callback){
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

// Return the user in function of the username
module.exports.getUserByUsername = function(username, callback){
  var query = {username: username};
  User.findOne(query, callback);
}

// Return the user in function of the ID
module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

// Compare the password when a user registration.
module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
};