
	
			
		$(document).keypress(function(e) 
		{
		  $current = $('#slider').slider('value');
		   switch(e.keyCode)
		   {   
		     case 38:
		     if($current > 0)
		     { 
		       $current= $current-1;
		       skipTo($current);
		     }
		     break;
		     
		     case 40:
		     
		     if($current < $('#coverflow > *').length-1)
		     { 
		       $current = $current+1;
		       skipTo($current);
		      }	     
		     break;
		   }
		});
		
