/***
 * NOTE: My initial submission worked only when served from a webserver. For grading purposes, the * page needs to be loaded offline from a local filesystem. As a result, I am hard-coding the
 * gallery into the html and removing the ajax calls.
 */

var photoRatio = 1.6; //width/height of photos
var viewportWidth;
var viewportHeight;
var resizeViewportTimeout;

/***
 * NOTE: The mockup showed the navigation arrows outside the photo; however, I needed
 * a way to detect when the screen ratio is less than that of the photos so I can pull
 * the navigation arrows inside the photo instead of letting them stay outside because
 * when the screen is taller than it is wide (portrait) the photo's edges are rendered
 * right up next to the edge of the window. I initially tried to override the CSS of
 * the lightbox but that was disastrous mainly because the plugin uses JS to dynamically
 * update the styles and manually changing these values upsets the whole lightbox system.
 */

function resizeViewport() {
  
  viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  
  var viewportRatio = viewportWidth / viewportHeight;
  
  if ((viewportRatio) >= photoRatio) {
    $('.lb-nav a.lb-next').addClass('landscape');
    $('.lb-nav a.lb-prev').addClass('landscape');
  } else {
    $('.lb-nav a.lb-next').removeClass('landscape');
    $('.lb-nav a.lb-prev').removeClass('landscape');
  }
  
  if ((viewportRatio < (photoRatio - 0.2)) || (viewportRatio > (photoRatio + 0.2))) {
    $('.lb-data a.lb-close').hide();
  } else {
    $('.lb-data a.lb-close').show();
  }
  
}

$(window).on('resize', function () {
  
  clearTimeout(resizeViewportTimeout);
  resizeViewportTimeout = setTimeout(resizeViewport, 200);
  
});

/***
 * NOTE: I needed a way to add .landscape to the next and prev arrows to pull them inside
 * of the photo if the screen ratio was less than that of the photo because the photo is
 * right up against the edge of the screen in this case. When the ratio is equal to or
 * greater than that of the photo, the arrows can fit in the margin (using negative margins)
 * on either side of the photo. My first naive approach was to simply call resizeViewport()
 * right after calling lightbox. However, there was be some async code going on because
 * the next and prev elements did not exist yet when my function was called. Looking through
 * lightbox.js I found the build function creates the elements in the DOM so I hijacked that
 * function and added my own resizeViewport() after it in the code below.
 */
var _lightboxBuild = lightbox.build;

lightbox.build = function() {

  _lightboxBuild.apply(this, arguments);
  
  resizeViewport();
  
}

lightbox.option({
  
  'resizeDuration': 200,
  'wrapAround': true,
  'showImageNumberLabel': false,
  'alwaysShowNavOnTouchDevices': true
  
});

/***
 * NOTE: I tried to implement my own search function using a jquery keypress handler
 * but I found that keypress fires before the value in the input element is updated
 * so I switched to on input event
 */

$('#search input').on('input', function () {
  
  /***
   * NOTE: My intent is to tokenize words and combine them with a logical OR so the user can
   * enter several keywords or keyword fragments and photos containing those words/fragments
   * in the caption strings will be displayed and others hidden. Hidden photos should not
   * show up in lightbox.
   */
  
  var input = this.value;
  
  if (input != '') {
    
    var tokens = input.split(' ');
    
    $('#gallery a').hide().removeAttr('data-lightbox'); // hide all

    for (var index = 0, length = tokens.length; index < length; index++) {

      if (tokens[index] == '') continue; // skip blank tokens
      
      /***
       * NOTE: this was more elegant in my opinion but did not work in IE. Firefox, Chrome, and
       * Safari worked fine.
       *

       $('#gallery a[data-title*="' + tokens[index] +'" i]').show().attr('data-lightbox', 'gallery'); 
       
       * The following approach should work for IE and Edge too.
       */

      $('#gallery a[data-title]').filter(function () {
        
        if ($(this).attr('data-title').toLowerCase().indexOf(tokens[index].toLowerCase()) > -1) {
          $(this).show().attr('data-lightbox', 'gallery');
        }
        
      });
      
    }
    
  } else {
    
    $('#gallery a').show().attr('data-lightbox', 'gallery'); // show all
    
  }

});