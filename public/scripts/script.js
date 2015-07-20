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
    console.log("refreshed")
  },


  // add new comment to front page
    save: function (newUser, newStatus) {
      var statusData = {status: status};


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
        // console.log('event handlers loaded');
        
        // //add event-handler to new-Comment modal
        // $('#new-comment').on('click', function(event) {
        //   event.preventDefault();

        //   //create new Comment with form data
        //   var newStatus = $('#comment-text').val(); 
        //   gameController.save(newStatus);

        //   // reset the form
        //   $(this)[0].reset();
        //   $('#comment-text').focus();
          

        // });

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
      }
      

  }; //end gameController
  gameController.setupView();
});