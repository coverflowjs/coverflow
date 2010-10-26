/*

  jQuery UI CoverFlow 2010.
  This version by Addy Osmani
  Base code for original pre-updated plugin: Paul Baukaus
*/

	$(function() {
		
		
        var defaultItem  = 0;
		var listContent = "";
		var html = $('#demo-frame div.wrapper').html();
		$('#demo-frame div.wrapper').parent().append(html).end().remove();
		
		
		
		   
		   
		setDefault(6);
		
		

           //Set the default item to display on load.
           //Correct indexing
		   function setDefault($n)
		   {
		      defaultItem = $n-1;
		   }

			
			//Initialize CoverFlow
			$("#coverflow").coverflow({
			    item: defaultItem,
			    duration:1200,
				select: function(event, sky) {
					$('#slider').slider('value', sky.value);
					$('.coverflowItem').removeClass('ui-selected');
	                $('.coverflowItem:eq(' + (sky.value) +')').addClass('ui-selected');
					
				}
			});
			

           //Initialize Slider
			$("#slider").slider({
				min: 0,
				max: $('#coverflow > *').length-1,
				value: defaultItem,
				slide: function(event, ui) {
					$('#coverflow').coverflow('select', ui.value, true);
					$('.coverflowItem').removeClass('ui-selected');
	                $('.coverflowItem:eq(' + (ui.value-1) +')').addClass('ui-selected');

				}
			});
			
				
		   //Skip to an item in the CoverFlow	
		   function skipTo($itemNumber)
           {
              $("#slider").slider( "option", "value", $itemNumber);
              $('#coverflow').coverflow('select', $itemNumber, true);
              $('.coverflowItem').removeClass('ui-selected');
	          $('.coverflowItem:eq(' + ($itemNumber) +')').addClass('ui-selected');
	          
	          //
	          
	          
	         
           }



		//Generate the text-list of items below the coverflow images.
		$('#coverflow img').each(function(index, value)
		{
		   $artist = $(this).data('artist');
		   $album = $(this).data('album');
		   
		   try
		   {
		      listContent += "<li class='ui-state-default coverflowItem' data-itemlink='" 
		                   + (index) +"'>" + $artist + " - " + $album +"</li>";
		   }
		   catch(e)
		   { 
		   }
		});
		
		$('#sortable').html(listContent);
		$('.coverflowItem:eq(' + (defaultItem) +')').addClass('ui-selected');
		
		//Assign click event for coverflow images 
		$('body').delegate('.coverflowItem','click', function()
		{
		   skipTo($(this).data('itemlink'));
		});
		
		
		
		//Handle keyboard events
		$(document).keydown(function(e) 
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
		
		

	   //change the main div to overflow-hidden as we can use the slider now
	$("#scroll-pane").css('overflow','hidden');
	
	//calculate the height that the scrollbar handle should be
	var difference = $("#sortable").height()-$("#scroll-pane").height();//eg it's 200px longer 
	var proportion = difference / $("#sortable").height();//eg 200px/500px
	var handleHeight = Math.round((1-proportion)*$("#scroll-pane").height());//set the proportional height

	//set up the slider	
	$("#slider-vertical").slider({
		orientation: "vertical",
		range: "max",
		min: 0,
		max: 100,
		value: 0 ,
		slide: function(event, ui) {
			var topValue = -((100-ui.value)*difference/100);
			$("#sortable").css({top:topValue});//move the top up (negative value) by the percentage the slider has been moved times the difference in height
		}
	});
	
	
	var origSliderHeight = $("#slider-vertical").height();//read the original slider height
	var sliderHeight = origSliderHeight - handleHeight ;//the height through which the handle can move needs to be the original height minus the handle height
	var sliderMargin =  (origSliderHeight - sliderHeight)*0.5;//so the slider needs to have both top and bottom margins equal to half the difference
	
	
	
	function setScrollPositions(item)
	{
	
	var q =  item * 5;
	var qx = -40;

	$('#slider-vertical').slider('value', q);
	$('#sortable').css('top', -q + qx);
	

	}
	
	
	setScrollPositions(defaultItem);

	
	
//mousewheel support
	
	$(document).mousewheel(function(event, delta){
	
  		var speed = 1;
	    var sliderVal = $("#slider").slider("value");//read current value of the slider
		var coverflowItem = 0;
		var cflowlength = $('#coverflow > *').length-1;

  
       
       if(delta > 0 && sliderVal > 0)
       {
         
           sliderVal -=1;
         
       }else{
          
          if(delta < 0 && sliderVal < cflowlength)
          {
           sliderVal +=1;
           }
          
       }
       
       
       
       
		var leftValue = -((100-sliderVal)*difference/100);//calculate the content top from the slider position
		
		if (leftValue>0) leftValue = 0;//stop the content scrolling down too much
		if (Math.abs(leftValue)>difference) leftValue = (-1)*difference;//stop the content scrolling up too much
		
		coverflowItem = Math.floor(sliderVal);
		skipTo(coverflowItem);
	
	
	//
	var sliderVal2 = $("#slider-vertical").slider("value");
	sliderVal2 += (delta*50);
	
	$("#slider-vertical").slider("value", (sliderVal2));
	var topValue = -((100-sliderVal2)*difference/100);//calculate the content top from the slider position
		
	if (topValue>0) topValue = 0;//stop the content scrolling down too much
	if (Math.abs(topValue)>difference) topValue = (-1)*difference;//stop the content scrolling up too much
		
		
		
	$("#sortable").css({top: (coverflowItem * -25 ) });//move the content to the new position


	
	    event.preventDefault();//stop any default behaviour
 	});
	

		
	

		
});

