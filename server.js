
// SERVER-SIDE JAVASCRIPT

// require express framework and additional modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    _ = require('underscore'),
    mongoose = require('mongoose'),
    Comment = require('./models/comment'),
    session = require('express-session'),
    User = require('./models/user'),
    cors = require('cors'),
    Score = require('./models/score');
// require('./models/user.js');
    mongoose.connect(
      process.env.MONGOLAB_URI ||
      process.env.MONGOHQ_URL ||
      'mongodb://localhost/projectone' // plug in the db name you've been using
    );

    // tell app to use bodyParser middleware
    app.use(bodyParser.urlencoded({extended: true}));


//AUTHENTICATION

// setup session using cookies
app.use(session ({
  saveUninitialized: true,
  resave: true,
  secret: 'SecretCookieSecret',
  cookie: { maxAge: 60000}
}));


//functions to manage sessions (login logout and current user)
app.use('/', function (req, res, next) {
  //saves userId in session for logged in user
  req.login = function (user) {
    req.session.userId = user.id;
  };

  //finds user currently logged in based on 'session'
  req.currentUser = function (callback) {
    User.findOne({_id: req.session.userId}, function (err, user) {
      req.user = user;
      callback(null, user);
    });
  };

  // destroy 'session' to log user out
  req.logout = function () {
    req.session.userId = null;
    req.user = null;
  };

  next();
})


// get route to show all users
app.get('/users', function (req, res) {
  User.find(function (err, users) {
    console.log('users are: ', users);
    res.send(users);
  })
})

// user submits the signup form
app.post('/users', function (req, res) {

  // grab user data from params (req.body)
  
  var newUser = req.body;
  console.log("req.body", newUser);
  // create new user with secure password
  User.createSecure(newUser.email, newUser.password, newUser.username, function (err, user) {
    res.send(user);
  });
});

// creates a new session
app.post('/api/sessions', function (req, res) {
  User.authenticate(req.body.email, req.body.password, function (error, user) {
    req.session.user = user;
    res.redirect('/login');
  });
});

// login and authenticate usename and password
app.post('/login', function (req, res) {

  //grab user data from req.body
  var userData = req.body;

  //call authenticate function to check if password user entered is correct
  User.authenticate(userData.email, userData.password, function (err, user) {
    req.login(user);

    //redirect to user profile
    res.redirect('/profile');
  });
});


//STATIC ROUTES

// serve js and css pages on main page
app.use(express.static(__dirname + '/public'))


// set up root route to respond with index.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/views/index.html');
});

// set up route to respond to calls for signup.html
app.get('/signup', function (req, res) {
  res.sendFile(__dirname + '/public/views/signup.html');
});

app.get('/profile', function (req, res) {
  res.sendFile(__dirname + '/public/views/profile.html');
})
//API ROUTES

//Comment index
app.get('/api/comment', function (req, res) {
  //send all Comment as JSON response
  Comment.find(function (err, comments){
    res.json(comments);
  })
});

//create new Comment
app.post('/api/comment', function (req, res) {

  console.log("this is before my new comment");
  // grab params from form data (user, status)
  var newComment = new Comment({
    status: req.body.status
  })
     console.log("this is after my comment", newComment);

  //save new Comment into database
  newComment.save(function (err, savedComment) {
    res.json(savedComment);
  });
});

// find a Comment by the id
app.get('/api/comment/:id', function (req, res) {
  // set the value of the id
  var targetId = req.params.id;

  // find Comment in db by id
  Comment.findOne({_id: targetId}, function (err, foundComment) {
    res.json(foundComment);
  });
});
  
// update Comment
app.put('/api/comment/:id', function (req, res) {

  //set the value of the id
  var targetId = req.params.id;

  // find the phrase in db by id
  Comment.findOne({_id:targetId}, function (err, foundComment){
    //update the Comment's user and body
    // foundComment.user = req.body.user;
    foundComment.status = req.body.status;

    //save updated Comment in db
    foundComment.save(function (err, savedComment) {
      res.json(savedComment);
    });
  });
});

// delete Comment
app.delete('/api/comment/:id', function (req, res) {

    //set the value of the id
  var targetId = req.params.id;

  // find Comment in db by id and remove 
  Comment.findOneAndRemove({_id: targetId}, function (err, deletedComment) {
    res.json(deletedComment);
  });
});

// LEADERBOARD

app.get('/api/score', function (req, res) {
  Score.find(function (err, scores) {
    res.json(scores);
    console.log("scores", scores);
  });
});

app.post('/api/score', function (req, res) {
  // grab params from form data (user, score)
  var newScore = new Score({
    status: 0 //this is where we put the route to the game score
  })
  console.log("newScore", newScore);
  //save new Comment into database
  newScore.save(function (err, savedScore) {
    console.log("savedScore", savedScore);
    res.json(savedScore);
  });
})



// listen on port 5000
app.listen(process.env.PORT || 3000, function () {
  console.log('server started on');
});