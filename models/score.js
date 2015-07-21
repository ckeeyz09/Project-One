var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ScoreSchema = new Schema ( {
  username: String,
  score: Number
});
 
var Score = mongoose.model('Score', ScoreSchema, 'scores');

module.exports = Score;