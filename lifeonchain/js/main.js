if (!slope) 
  var slope = 0.08;

$(document).ready(function(){
    updateSlope();
});

$(window).on('resize', function(){
    updateSlope();
});

function updateSlope(){
    var windowWidth = $(window).width();
    $('.shape-right-left, .shape-left-right').css('margin-top', (-windowWidth*slope)+'px');
    $('.shape-right-left, .shape-left-right').css('border-top-width', (windowWidth*slope)+'px');
    $('.shape-bottom-right-left, .shape-bottom-left-right').css('border-bottom-width', (windowWidth*slope)+'px');

    $('.trapezoid-img-left').each(function(){
        var width = $(this).width();
        var height = $(this).height();
        if(windowWidth < 768){
          $(this).css('clip-path', 'polygon(0% '+(width*slope)+'px, 100% 0%, 100% 100%, 0% 100%')
        }
        else{
          $(this).css('clip-path', 'polygon(0% '+(width*slope)+'px, 100% 0%, 100% 100%, 0% '+(height-width*slope)+'px)')
        }
    });

    $('.trapezoid-img-right').each(function(){
        var width = $(this).width();
        var height = $(this).height();
        if(windowWidth < 768){
          $(this).css('clip-path', 'polygon(0% 0%, 100% '+(width*slope)+'px, 100% 100%, 0% 100%)')
        }
        else{
          $(this).css('clip-path', 'polygon(0% 0%, 100% '+(width*slope)+'px, 100% '+(height-width*slope)+'px, 0% 100%)')
        }
    });
}

var countDownDate = new Date("Nov 3, 2019 00:00:00").getTime();

// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();
    
  // Find the distance between now and the count down date
  var distance = countDownDate - now;
    
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
  // Output the result in an element with id="demo"
  $('#countdown_day').html(format(days));
  $('#countdown_hour').html(format(hours));
  $('#countdown_min').html(format(minutes));
  $('#countdown_sec').html(format(seconds));
}, 1000);

function format(num){
    if(num < 0)
      return '00';
    else if(num < 10)
      return '0'+num;
    return num
}

function hover(element) {
  element.setAttribute('src', '/img/signup-hover.png');
}

function unhover(element) {
  element.setAttribute('src', '/img/signup.png');
}