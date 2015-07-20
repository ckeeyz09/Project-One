

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: String,
  password: String,
  username: String
});

var User = mongoose.model('User', UserSchema);

UserSchema.statics.authenticate = function (email, password, callback) {
  this.findOne({email: email}, function (err, user) {
    console.log(user);
    if (user === null) {
      throw new Error('Can\'t find user with email' + email);
    }
    else if (user.checkPassword(password)) {
      callback(null, user);
    }
  });
};

UserSchema.methods.checkPassword = function (password) {
  return password == this.password;
}

module.exports = User;