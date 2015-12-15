$(function(){
    $("#gotop").click(function(){
        jQuery("html,body").animate({
            scrollTop:0
        },1000);
    });
    $(window).scroll(function() {
        if ( $(this).scrollTop() > 150){
            $('#gotop').fadeIn("fast");
        } else {
            $('#gotop').stop().fadeOut("fast");
        }
    });
});


$(function(){
    $(window).load(function(){
        $(window).bind('scroll resize', function(){
            var $this = $(this);
            var $this_Top=$this.scrollTop();

            if($this_Top < 10){
                $('#top-bar').css('box-shadow', '0px 0px 0px 0px');
                $('#top-bar').css('opacity', '0.8');
            }
            if($this_Top > 10){
                $('#top-bar').css('box-shadow', '0px 0px 10px 4px rgba(220,220,220,0.9)');
                $('#top-bar').css('opacity', '0.95');
            }
        }).scroll();
    });
});
