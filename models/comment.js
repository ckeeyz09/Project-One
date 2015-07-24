

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('./user.js');

var CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status: String
});

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;