$(document).ready(function(){
		
	$('.product').each(function(i, el){					
		// Lift card and show stats on Mouseover
		$(el).find('.make3D').hover(function(){
				$(this).parent().css('z-index', "20");
				$(this).addClass('animate');		
			 }, function(){
				$(this).removeClass('animate');			
				$(this).parent().css('z-index', "1");
		});			
	});
});


