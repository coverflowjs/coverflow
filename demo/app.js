/*

  jQuery UI CoverFlow II for jQueryUI 1.8.6 / core 1.4.4
  Copyright Addy Osmani 2010.
*/

	$(function() {
	

        var defaultItem  = 0;
		var listContent = "";
		var html = $('#demo-frame div.wrapper').html();
		var imageCaption = $('#imageCaption');
		$('#demo-frame div.wrapper').parent().append(html).end().remove();
		
		
		$sliderCtrl = $('#slider');
		$coverflowCtrl = $('#coverflow');
		$coverflowImages = $('#coverflow img');
		$sliderVertical  = $("#slider-vertical");
		
			   
	    //Set the default image index.   
		setDefault(7);
		

           //Set the default item to display on load.
           //Correct indexing
		   function setDefault($n){
		      defaultItem = $n-1;  
		   }
		   
		   //set the image caption
		   function setCaption($t)
		   {
		     imageCaption.html($t);
		   }

			
			//Initialize CoverFlow
			$coverflowCtrl.coverflow({
			    item: defaultItem,
			    duration:1200,
				select: function(event, sky) 
				{
				skipTo(sky.value);

				}
			});
			

           //Initialize Slider
			$sliderCtrl.slider({
				min: 0,
				max: $('#coverflow > *').length-1,
				value: defaultItem,
				slide: function(event, ui) {
					$coverflowCtrl.coverflow('select', ui.value, true);
					$('.coverflowItem').removeClass('ui-selected');
	                $('.coverflowItem:eq(' + (ui.value) +')').addClass('ui-selected');
	                setCaption($('.coverflowItem:eq(' + (ui.value) +')').html());

				}
			});
			
				
		   //Skip to an item in the CoverFlow	
		   function skipTo($itemNumber)
           {  
              $sliderCtrl.slider( "option", "value", $itemNumber);
              $coverflowCtrl.coverflow('select', $itemNumber, true);
              $('.coverflowItem').removeClass('ui-selected');
	          $('.coverflowItem:eq(' + ($itemNumber) +')').addClass('ui-selected');
	          setCaption($('.coverflowItem:eq(' + ($itemNumber) +')').html());

           }



		//Generate the text-list of items below the coverflow images.
		$coverflowImages.each(function(index, value)
		{
		   $artist = $(this).data('artist');
		   $album = $(this).data('album');
		   
		   try{
		      listContent += "<li class='ui-state-default coverflowItem' data-itemlink='" 
		                   + (index) +"'>" + $artist + " - " + $album +"</li>";
		   }catch(e){ 
		   }
		});
		
		
		//Skip all controls to the current default item
		$('#sortable').html(listContent);
		skipTo(defaultItem);
		
		//Assign click event for coverflow images 
		$('body').delegate('.coverflowItem','click', function()
		{
		   skipTo($(this).data('itemlink'));
		});
		
		
		
		//Handle keyboard events
		$(document).keydown(function(e){
		  $current = $sliderCtrl.slider('value');
	
		   switch(e.keyCode)
		   {   
		     case 38:
		     if($current > 0){ 
		       $current= $current-1;
		       skipTo($current);
		     }
		     break;
		     
		     case 40:
		     
		     if($current < $('#coverflow > *').length-1){ 
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
	$sliderVertical.slider({
		orientation: "vertical",
		range: "max",
		min: 0,
		max: 100,
		value: 0 ,
		slide: function(event, ui) 
		{
			
			var topValue = -((100-ui.value)*difference/100);
			$("#sortable").css({top:topValue});//move the top up (negative value) by the percentage the slider has been moved times the difference in height
		}
	});

	
	var origSliderHeight = $sliderVertical.height();//read the original slider height
	var sliderHeight = origSliderHeight - handleHeight ;//the height through which the handle can move needs to be the original height minus the handle height
	var sliderMargin =  (origSliderHeight - sliderHeight)*0.5;//so the slider needs to have both top and bottom margins equal to half the difference
	
	
	/*Force the scrollers to bring the current item into view.*/
	/*This can all be commented out if not needed*/
	function setScrollPositions(item){
	
	var q =  item * 5;
	var qx = -35;

	$sliderVertical.slider('value', q);
	$('#sortable').css('top', -q + qx);
	

	}
	

	setScrollPositions(defaultItem);

	
	
//mousewheel support
	
	$(document).mousewheel(function(event, delta){
	
  		var speed = 1;
	    var sliderVal = $sliderCtrl.slider("value");//read current value of the slider
		var coverflowItem = 0;
		var cflowlength = $('#coverflow > *').length-1;

  
       
       if(delta > 0 && sliderVal > 0){
         
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
	
	    event.preventDefault();//stop any default behaviour
 	});
	

		
	

		
});

