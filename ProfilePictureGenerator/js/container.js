$(document).ready(function(){
	var screenHeight = $(window).height();
	var docHeight = $(document).height();

	if(docHeight > screenHeight){
		$('#container').css('height', docHeight+20);
	}
	else{
		$('#container').css('height', screenHeight);
	}
	
})
