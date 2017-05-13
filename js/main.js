var thumbnails = 'photos/thumbnails/';

$.ajax({
  
  url : thumbnails,
  success: function (data) {
    
    $(data).find('a').attr('href', function (index, url) {
      if( url.match(/\.jpg$/) ) {
        console.log(url);
        var photo = url.replace('\/thumbnails', '').replace('\\thumbnails', '');
        var thumbnail = url;
        var filename = url.match(/[^\\\/]+$/)[0];
        var number = filename.replace('.jpg', '');
        $('#gallery').append('<a data-lightbox="' + number + '" href="' + photo + '"><img src="' + thumbnail + '"></a>');
      }
    });
    
  }
});

