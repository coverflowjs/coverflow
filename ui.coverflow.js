/*
 * jQuery UI CoverFlow
   Original Component: Paul Bakaus
   Minor changes to appear more 'coverflow-like' in cooperation
   with front-end UI extension in app.js - Addy Osmani.
 */
(function($){



	var browserVersion = $.browser.version.replace(/^(\d+\.)(.*)$/, function() { return arguments[1] + arguments[2].replace(/\./g, ''); });
	var supportsTransforms = !($.browser.mozilla && (parseFloat(browserVersion) <= 1.9)) && !$.browser.opera;
	
	$.easing.easeOutQuint = function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	};

	$.widget("ui.coverflow", {
	
	   options: {
	   
	   items: "> *",
			orientation: 'horizontal',
			item: 0,
			trigger: 'click',
			center: true, //If set to false, the actual element's base position isn't touched in any way
			recenter: true //If set to false, the parent element's position doesn't get animated while items change
			
	  },
		
		_create: function() {
			
			var self = this, o = this.options;
			this.items = $(o.items, this.element);
			this.props = o.orientation == 'vertical' ? ['height', 'Height', 'top', 'Top'] : ['width', 'Width', 'left', 'Left'];
			this.itemSize = this.items['outer'+this.props[1]](1);
			this.itemWidth = this.items.width();
			this.itemHeight = this.items.height();
			this.duration = o.duration;
			this.current = o.item; //Start item
			
			
			
		
			//Bind click events on individual items
			this.items.bind(o.trigger, function() {
				self.select(this);
				
			});


			//Center the actual parent's left side within it's parent
			
			
			
			this.element.css(this.props[2],
				(o.recenter ? -this.current * this.itemSize/2 : 0)
				+ (o.center ? this.element.parent()[0]['offset'+this.props[1]]/2 - this.itemSize/2 : 0) //Center the items container
				- (o.center ? parseInt(this.element.css('padding'+this.props[3]),10) || 0 : 0) //Subtract the padding of the items container
			);

			//Jump to the first item
			this._refresh(1, 0, this.current);

		},
		
		select: function(item, noPropagation) {
		
			
			this.previous = this.current;
			this.current = !isNaN(parseInt(item,10)) ? parseInt(item,10) : this.items.index(item);
			
			
			//Don't animate when clicking on the same item
			if(this.previous == this.current) return false; 
			
			//Overwrite $.fx.step.coverflow everytime again with custom scoped values for this specific animation
			var self = this, to = Math.abs(self.previous-self.current) <=1 ? self.previous : self.current+(self.previous < self.current ? -1 : 1);
			$.fx.step.coverflow = function(fx) { self._refresh(fx.now, to, self.current); };
			
			// 1. Stop the previous animation
			// 2. Animate the parent's left/top property so the current item is in the center
			// 3. Use our custom coverflow animation which animates the item
			var animation = { coverflow: 1 };
			animation[this.props[2]] = (
				(this.options.recenter ? -this.current * this.itemSize/2 : 0)
				+ (this.options.center ? this.element.parent()[0]['offset'+this.props[1]]/2 - this.itemSize/2 : 0) //Center the items container
				- (this.options.center ? parseInt(this.element.css('padding'+this.props[3]),10) || 0 : 0) //Subtract the padding of the items container
			);
			
			
			//
			
			//
			
			
			//Trigger the 'select' event/callback
			if(!noPropagation) this._trigger('select', null, this._uiHash());
			
			this.element.stop().animate(animation, {
				duration: this.options.duration,
				easing: 'easeOutQuint'
			});
			
		},
		
		_refresh: function(state,from,to) {
		
	
			var self = this, offset = null;
	
			
			this.items.each(function(i) 
			{
			
				
				var side = (i == to && from-to < 0 ) ||  i-to > 0 ? 'left' : 'right',
					mod = i == to ? (1-state) : ( i == from ? state : 1 ),
					before = (i > from && i != to),
					css = { zIndex: self.items.length + (side == "left" ? to-i : i-to) };
					
					
					///
				     /*
				       notes: cache this. fix animation for 1.8.6
				     */
				     
				     var thisCover = $(this);
				     
					thisCover.css('z-index', self.items.length + (side == "left" ? to-i : i-to));
					thisCover.css('-moz-transform', 'matrix(1,'+(mod * (side == 'right' ? -0.2 : 0.2))+',0,1,0,0) scale('+(1+((1-mod)*0.3)) + ')');
			        thisCover.css('width','260px');
			        thisCover.css('height','260px');
			        thisCover.css('left', ( (-i * (300/2)) + (side == 'right'? -300/2 : 300/2) * mod ) + 'px');
					
					//
					
				
		//css[($.browser.safari ? 'webkit' : 'Moz')+'Transform'] = 'matrix(1,'+(mod * (side == 'right' ? -0.2 : 0.2))+',0,1,0,0) scale('+(1+((1-mod)*0.3)) + ')';
				
	         
	
				
				css[self.props[2]] = ( (-i * (self.itemSize/2)) + (side == 'right'? -self.itemSize/2 : self.itemSize/2) * mod );
				
			


				if(!supportsTransforms) {
					css.width = self.itemWidth * (1+((1-mod)*0.5));
					css.height = css.width * (self.itemHeight / self.itemWidth);
					css.top = -((css.height - self.itemHeight) / 2);
				}
	
	
	
	
				
				//$(this).css(css);
				
				

					

			});
			
			//This fixes Safari reflow issues
			this.element.parent().scrollTop(0);
			
		},
		
		_uiHash: function() {
			return {
				item: this.items[this.current],
				value: this.current
			};
		}
		
	});

	
})(jQuery); 