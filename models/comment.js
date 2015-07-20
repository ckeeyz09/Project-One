

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
  user: String,
  status: String
});

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;