$(function (){

  var gameController= {

    cTemplate = _.template($('#comment-template').html());
    sArray = [];

//setup view on home page
  all: function (image, game, status) {
    $.ajax ({
      type: 'GET',
      url: '/api/status',
      data: {
        image: image,
        game: game, 
        status: status
      },
      success: function (data) {
        var allStatus = data;
        _.each(allStatus, function(status) {
          // pass each phrase object through template and append to view
          gameController.render(status);
        });
        gameController.addEventHandlers();
      }
    })
  },

  };
});