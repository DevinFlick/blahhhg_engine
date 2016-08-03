var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
});

var User = mongoose.model('User', userSchema);
module.exports = User;
