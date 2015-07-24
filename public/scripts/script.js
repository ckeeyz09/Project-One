$(function (){


  var gameController= { 
 
    cTemplate: _.template($('#comment-template').html()),
    

//setup render function to push data to template
  render: function (data) {
    var $cHtml = $(gameController.cTemplate(data));
    $('#comment-list').prepend($cHtml);
  },

//setup view on home page
  all: function (user, status) {
    $.ajax ({
      type: 'GET',
      url: '/api/comment',
      data: {
        user: user, 
        status: status
      },
      success: function (data) {
        var allComment = data;
        _.each(allComment, function(comment) {
          // pass each phrase object through template and append to view
          gameController.render(comment);
        });
        gameController.addEventHandlers();
      }
    })
  },


  // add new comment to front page
    save: function (status) {
      var statusData = {
        status: status
      };


      $.post('/api/comment', statusData, function (data) {
        gameController.render(data);
      });
    },

    // edit Comment comment on view page
      update: function(commentId, updateStatus) {
        $.ajax({
          type: 'PUT',
          url: '/api/comment/' + commentId,
          data: {
            status: updateStatus
          },
          success: function(data){
            var updatedComment = data;

            // replace existing Comment with updated Comment
            var $cHtml = $(gameController.cTemplate(updatedComment));
            $('#comment-' + commentId).replaceWith($cHtml);
          }
        })
      },


      //delete Comment from page
      delete: function (commentId) {
        $.ajax({
          type: 'DELETE',
          url: '/api/comment/' + commentId,
          success: function (data) {

            //remove deleted Comment from view
            $('#comment-' + commentId).remove();
          }
        })
      },


      //event handlers for page
      addEventHandlers: function () {

        // for update: submit event on '.update-comment' form
        $('#comment-list').on('submit', '.update-comment', function(event){
          event.preventDefault();
          console.log("on click submit, new comment button");
          // find the comment's id (stored in HTML as 'data-id')
          var commentId = $(this).closest('.comment').attr('data-id');

          //update the Comment with form data
          var updatedStatus = $(this).find('.updated-status').val();
          gameController.update(commentId, updatedStatus);
        });

        // for delete: click event on `.delete-comment` button
        $('#comment-list').on('click', '.delete-comment', function(event) {
          event.preventDefault();
          var commentId = $(this).closest('.comment').attr('data-id');
          gameController.delete(commentId);
        }); 

        console.log("after submit button");
      },

      setupView: function() {
        //sppend existing Comment to view
        gameController.all();
        $('#new-comment').on('submit', function (event) {
          event.preventDefault();
          var commentText = $('#comment-text').val();
          gameController.save(commentText);

          $(this)[0].reset();
        });
      },
    


  }; //end gameController
  gameController.setupView();

      var scoreArray = [];

      var sTemplate = _.template($('#score-template').html());

  var scoreController = {
      //LEADERBOARD
      //populate scores to the leaderboard
      all: function (user, score) {
        $.ajax ({
          type: 'GET',
          url: '/api/score',
          data: {
            user: user, 
            score: score
          },
          success: function (data) {
            var allComment = data;
            _.each(allComment, function(score) {
              // pass each phrase object through template and append to view
              scoreArray.push(score);
            });
            scoreController.sort(scoreArray);
          }
        })
      },

      render: function (data) {
        var $sHtml = $(gameController.sTemplate(data));
        $('#score-list').append($sHtml);
      },

      //push new score to the list
      sort: function (scoreArray) {
        scoreArray.sort(function(a, b) {return b[1] - a[1]})

        $.post('/api/score', scoreArray, function (data) {
          gameController.render(data);
        });
      },

      setupView: function () {
        scoreController.all();

      }
  }; // end scoreController
  scoreController.setupView();


  // Login/sign up/logout functionality
  var loggedOut = function () {
    $("#login-name").text("");
    $("#signup-login").removeClass("hidden");
    $("#logged-in").addClass("hidden");
  }

  var loggedIn = function () {
    $("#signup-login").addClass("hidden");
    $("#logged-in").removeClass("hidden");
  }

  $.ajax({
    url: '/api/current',
    type: "GET",
    success: function (data) {
      if (data) {
        $("#login-name").text(data.username);
        loggedIn();
      } else {
        loggedOut();
      }
    },
    error: function () {
      console.log("Error, could not GET username");
    }
  });

  $("#signup-form").on("submit", function (event) {
    event.preventDefault();
    var newUserObj = {
      username: $("#username-signup").val(),
      password: $("#password").val()
    }
    $("#signup-modal").modal("hide");
    $.ajax({
      url: "/api/users",
      type: "POST",
      data: newUserObj,
      success: function (data) {
        $("#login-name").text(data.username);
        loggedIn();
        alert("You have logged in!");
      },
      error: function () {
        console.log("Error, could not post new User!");
      }
    });
  });

  $("#loginForm").on('submit', function (event) {
    event.preventDefault();
    var loginUserObj = {
      email: $("#login-email").val(),
      password: $("#login-password").val()
    }
    $("#login-modal").modal("hide");
    $.ajax({
      url: '/login',
      type: "POST",
      data: loginUserObj,
      success: function (data) {
        $("#login-name").text(data.username);
        loggedIn();
        alert("You have logged in!");
      },
      error: function () {
        console.log("Error, could not log in");
      }
    });
  });

  $("#logout-button").on('click', function (event) {
    event.preventDefault();
    $.ajax({
      url: '/logout',
      type: 'GET',
      success: function (data) {
        loggedOut();
        alert("You have logged out");
      },
      error: function () {
      }
    });
  });
  // END login/sign up/logout functionality

  //VALIDATION

  $('#signupForm').validate({
    rules: {
      username: {
        required: true,
        minlength: 2
      },
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 6
      },
      confirm_password: {
        required: true,
        minlength: 6,
        equalTo: '#signup-password'
      }
    },
    messages: {
      username: {
        required: "Please enter a username",
        minlength: "Your username must be at least 2 characters"
        },
        email: {
          required: "Please enter an email",
          email: "Email must be valid"
        },
        password: {
          required: "Please enter a password",
          minlength: "Password must be at least 6 characters"
        },
        confirm_password: {
          required: "Please enter a password",
          minlength: "Password must be at least 6 characters",
          equalTo: "Passwords do not match"
        }
    }
  });

  $('#loginForm').validate({
    rules: {
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 6
      }
    },
    messages: {
        email: {
          required: "Please enter an email",
          email: "Email must be valid"
        },
        password: {
          required: "Please enter a password",
          minlength: "Password must be at least 6 characters in length"
        }
      }
  })


});