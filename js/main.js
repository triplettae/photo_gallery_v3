var thumbnails = 'photos/thumbnails/';

$.ajax({
  
  url : thumbnails,
  success: function (data) {
    
    $(data).find('a').attr('href', function (index, url) {
      if( url.match(/\.jpg$/) ) {
        var photo = url.replace("/thumbnails", "");
        var thumbnail = url;
        var name = url.match(/[^//]+[^.jpg]$/);
        $('#gallery').append('<a data-lightbox="' + name + '" href="' + photo + '"><img src="' + thumbnail + '"></a>');
      }
    });
    
  }
});

