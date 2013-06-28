/*
 * CoverflowJS
 *
 * Refactored for jQuery 1.8 / jQueryUI 1.9 Sebastian Sauer
 * Re-written for jQueryUI 1.8.6/jQuery core 1.4.4+ by Addy Osmani with adjustments
 * Maintenance updates for 1.8.9/jQuery core 1.5, 1.6.2 made.
 * Original Component: Paul Bakaus for jQueryUI 1.7
 *
 * Released under the MIT license.
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 *  jquery.ui.effect.js
 *
 * - in case you want swipe support and you don"t use jQery mobile yet:
 * jquery-mobile.custom.js
 *
 * Events:
 *  beforeselect
 *  select
 */

(function( $ ) {

	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

	// requestAnimationFrame polyfill by Erik Möller
	// fixes from Paul Irish and Tino Zijdel

	var el = document.body || document.documentElement,
		style = el.style,
		lastTime = 0,
		vendors = [ "ms", "moz", "webkit", "o" ],
		vendorsLength = vendors.length,
		x = 0,
		capitalize = function( string ) {
			return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
		};

	for( ; x < vendorsLength && ! window.requestAnimationFrame ; x++ ) {
		requestAnimationFrame = window[ vendors[ x ] + "RequestAnimationFrame" ];
		cancelAnimationFrame =
			window[ vendors[ x ] + "CancelAnimationFrame" ]
			|| window[ vendors[ x ] + "CancelRequestAnimationFrame" ];
	}

	if( ! window.requestAnimationFrame && ! window.cancelAnimationFrame ) {

		requestAnimationFrame = function( callback ) {
			var currTime = new Date().getTime(),
				timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) ),
				id = window.setTimeout(function() {
						callback( currTime + timeToCall );
					}, timeToCall );

			lastTime = currTime + timeToCall;
			return id;
		};

		cancelAnimationFrame = function(id) {
			clearTimeout( id );
		};

	}

	$.support.transform = "transform" in style
		? "transform"
		: false;

	$.support.transition = "transition" in style
		? "transition"
		: false;

	if( ! $.support.transform || ! $.support.transition ) {

		$.each( vendors, function( i, p ) {

			if( p !== "ms" ) {
				p = capitalize( p );
			}
			if( ! $.support.transform ) {
				if( p + "Transform" in style ) {
					$.support.transform = p + "Transform";
				}
			}
			if( ! $.support.transition ) {
				if( p + "Transition" in style ) {
					$.support.transition = p + "Transition";
				}
			}

			if( $.support.transform && $.support.transition ) {
				return false;
			}
			return true;
		});
	}

})( jQuery );

(function( $ ) {

	var availableCssTransitions = {

		/**
		 * @see http://matthewlein.com/ceaser/
		 *
		 * easing not available as css timing functions:
		 *
		 * easeInElastic
		 * easeOutElastic
		 * easeInOutElastic
		 *
		 * easeInBounce
		 * easeOutBounce
		 * easeInOutBounce
		 */


		// ease-in
		"easeInQuad" : "cubic-bezier( .55,.085,.68,.53 )",
		"easeInCubic": "cubic-bezier( .550, .055, .675, .190 )",
		"easeInQuart": "cubic-bezier( .895, .03, .685, .22 )",
		"easeInQuint": "cubic-bezier( .755, .05, .855, .06 )",
		"easeInSine" : "cubic-bezier( .47, 0, .745, .715 )",
		"easeInExpo" : "cubic-bezier( .95, .05, .795, .035 )",
		"easeInCirc" : "cubic-bezier( .6, .04, .98, .335 )",
		"easeInBack" : "cubic-bezier( .6, -.28, .735, .045 )",

		// ease-out
		"easeOutQuad" : "cubic-bezier( .25,.46,.45,.94 )",
		"easeOutCubic": "cubic-bezier( .215,.61,.355,1 )",
		"easeOutQuart": "cubic-bezier( .165, .84, .44, 1 )",
		"easeOutQuint": "cubic-bezier( .23, 1, .32, 1 )",
		"easeOutSine" : "cubic-bezier( .39, .575, .565, 1 )",
		"easeOutExpo" : "cubic-bezier( .19,1,.22,1 )",
		"easeOutCirc" : "cubic-bezier( .075, .82, .165, 1 )",
		"easeOutBack" : "cubic-bezier( .175, .885, .32, 1.275 )",

		// ease-in-out
		"easeInOutQuad" : "cubic-bezier( .455, .03, .515, .955 )",
		"easeInOutCubic": "cubic-bezier( .645, .045, .355, 1 )",
		"easeInOutQuart": "cubic-bezier( .77, 0, .175, 1 )",
		"easeInOutQuint": "cubic-bezier( .86, 0, .07, 1 )",
		"easeInOutSine" : "cubic-bezier( .445, .05, .55, .95 )",
		"easeInOutExpo" : "cubic-bezier( 1, 0, 0, 1 )",
		"easeInOutCirc" : "cubic-bezier( .785, .135, .15, .86 )",
		"easeInOutBack" : "cubic-bezier( .68, -.55, .265, 1.55 )"
	},
	eventsMap = {
		"transition":       "transitionend",
		"MozTransition":    "transitionend",
		"OTransition":      "oTransitionEnd",
		"WebkitTransition": "webkitTransitionEnd",
		"msTransition":     "MSTransitionEnd"
	},
	isOldie = (function() {

		if( $.browser != null ) {
			// old jQuery versions and jQuery migrate plugin users
			return $.browser.msie && ( ( ~~$.msie.version ) < 10 );
		}

		var match = /(msie) ([\w.]+)/.exec( navigator.userAgent.toLowerCase() );

		return match != null && match[ 1 ] && ( ~~ match[ 2 ] ) < 10;
	})();

	$.widget( "ui.coverflow", {

		options: {
			items: "> *",
			// item stacking - value 0>x<1
			stacking : 0.73,
			active: 0,
			duration : 400,
			easing: "easeOutQuint",
			// selection triggers
			trigger : {
				itemfocus : true,
				itemclick : true,
				mousewheel : true,
				swipe : true
			}
		},
		isTicking : false,
		_create: function () {

			var o = this.options;
			
			this.origStyle = $(this.element).attr("style") || "";

			this.items = this.element.find( o.items )
					// set tabindex so widget items get focusable
					// makes items accessible by keyboard
					.addClass( "ui-coverflow-item" )
					.prop( "tabIndex", 0 )
					.each(function(){
						$(this).data("origstyle", $(this).attr("style") || "");
					})

			this.element
				.addClass( "ui-coverflow" )
				.parent()
				.addClass( "ui-coverflow-wrapper ui-clearfix" );

			if( o.trigger.itemfocus ) {
				this._on( this.items, { focus : this._select });
			}

			if( o.trigger.itemclick ) {
				this._on( this.items, { click : this._select });
			}

			if( o.trigger.mousewheel ) {
				this._on({
					mousewheel: this._onMouseWheel,
					DOMMouseScroll: this._onMouseWheel
				});
			}

			if( o.trigger.swipe ) {
				this._on({
					swipeleft: this.next,
					swiperight: this.prev
				});
			}

			this.useJqueryAnimate = ! ( $.support.transition && $.isFunction( window.requestAnimationFrame ));
			this.transformItems = (!! $.support.transform) || isOldie;

			this.coverflowrafid = 0;
		},
		_init : function () {

			var o = this.options,
				css = {};

			o.stacking = parseFloat( o.stacking );
			o.stacking = o.stacking > 0 && o.stacking < 1
				? o.stacking
				: 0.73;

			o.duration = ~~ o.duration;
			if( o.duration < 1 ) {
				o.duration = 1;
			}

			this.itemMargin = - Math.floor( ( 1 - o.stacking ) / 2 * this.items.innerWidth() );
			this.currentIndex = this._isValidIndex( o.active, true ) ? o.active : 0;
			this.activeItem = this.items
				// apply a negative margin so items stack
				.css({
					marginLeft : this.itemMargin,
					marginRight : this.itemMargin
				})
				.removeClass( "ui-state-active" )
				.eq( this.currentIndex )
				.addClass( "ui-state-active" );

			this.itemWidth = this.items.width();
			this.itemHeight = this.items.height();
			this.itemSize = this.items.outerWidth( true );
			this.outerWidth = this.element.parent().outerWidth( false );

			// make sure there's enough space
			css.width = this.itemWidth * this.items.length;

			// Center the actual parents' left side within it"s parent
			$.extend( css, this._getCenterPosition() );
			this.element.css( css );

			// Jump to the first item
			this._refresh( 1, this._getFrom(), this.currentIndex );

			this.initialOffset = parseInt( this.activeItem.css( "left" ), 10 );

			this._trigger( "select", null, this._ui() );
		},
		_getCenterPosition : function () {
			var pos;

			pos = - this.currentIndex * this.itemSize / 2;
			pos += this.outerWidth / 2 - this.itemSize / 2;
			pos -= parseInt( this.element.css( "paddingLeft" ) ,10 ) || 0;
			pos = Math.round( pos );

			return { left : pos };
		},
		_isValidIndex : function ( index, ignoreCurrent ) {

			ignoreCurrent = !! ignoreCurrent;
			index = ~~index;
			return ( this.currentIndex !== index || ignoreCurrent ) && index > -1 && !! this.items.get( index );
		},
		_select: function ( ev ) {
			this.select( ev.currentTarget );
		},
		next : function () {
			return this.select( this.currentIndex + 1 );
		},
		prev : function () {
			return this.select( this.currentIndex - 1 );
		},
		_getFrom : function () {
			return Math.abs( this.previous - this.currentIndex ) <= 1
				? this.previousIndex
				: this.currentIndex + ( this.previousIndex < this.currentIndex ? -1 : 1 );
		},
		select : function( item ) {

			var o = this.options,
				index = ! isNaN( parseInt( item, 10 ) )
					? parseInt( item, 10 )
					: this.items.index( item ),
				animation;

			if( ! this._isValidIndex( index ) ) {
				return false;
			}

			if( false === this._trigger(
					"beforeselect",
					null,
					this._ui(
						this.items.eq( index ), index
					)
				)
			) {
				return false;
			}

			if( this.isTicking ) {
				if( this.useJqueryAnimate ) {
					this.element.stop( true, false );
				} else {

					if( this.coverflowrafid ) {
						cancelAnimationFrame( this.coverflowrafid );
					}

					this.element
						.unbind( eventsMap[ $.support.transition ] );
				}
			}
			this.isTicking = true;

			this.previousIndex = this.currentIndex;
			this.options.active = this.currentIndex = index;

			animation = {
				coverflow : 1
			};

			$.extend( animation, this._getCenterPosition() );

			if( this.useJqueryAnimate ) {
				this._animation( o, animation );
				return true;
			}

			$.extend( animation, {
				duration: o.duration,
				easing: o.easing
			});

			this._transition( animation );
			return true;
		},
		_animation : function( o, animation ) {

			var self = this,
				from = this._getFrom();

			//Overwrite $.fx.step.coverflow everytime again with custom scoped values for this specific animation
			$.fx.step.coverflow = function( fx ) {
				self._refresh( fx.now, from, self.currentIndex );
			};

			// 1. Stop the previous animation
			// 2. Animate the parent"s left/top property so the current item is in the center
			// 3. Use our custom coverflow animation which animates the item

			this.element
				.animate(
					animation,
					{
						duration: o.duration,
						easing: o.easing
					}
				)
				.promise()
				.done(function() {
					self._onAnimationEnd.apply( self );
				});
		},
		_transition : function( o ) {

			var self = this,
				d = new Date(),
				from = this._getFrom(),
				to = this.currentIndex,
				transitionFn = availableCssTransitions[ o.easing ] || availableCssTransitions.easeOutQuint,
				loopRefresh = function() {
					var state = ( (new Date()).getTime() - d.getTime() ) / o.duration;

					if( state > 1 ) {
						self.isTicking = false;
					} else {
						self._refresh( state, from, to );
					}

					if( self.isTicking ) {
						self.coverflowrafid = requestAnimationFrame( loopRefresh );
					}
				};

			this.coverflowrafid = requestAnimationFrame( loopRefresh );

			this.element
				.one( eventsMap[ $.support.transition ],
					function() {
						cancelAnimationFrame( self.coverflowrafid );

						self._refresh( 1, from, to );
						self._onAnimationEnd( self );
					}
				)
				.css($.extend( this._getCenterPosition(), {
					"transition" : "left " + o.duration + "ms " + transitionFn
				}));
		},
		_onAnimationEnd : function() {

			this.isTicking = false;
			this.activeItem = this.items
					.removeClass( "ui-state-active" )
					.eq( this.currentIndex )
					.addClass( "ui-state-active" );

			// fire select after animation has finished
			this._trigger( "select", null, this._ui() );
		},
		_refresh: function( state, from, to ) {
			var self = this;

			this.element
				.parent()
				.scrollTop( 0 );

			this.items.each( function ( i ) {

				var side = ( ( i === to && from - to < 0 ) || i - to  > 0 )
						? "left"
						: "right",
					mod = ( i === to )
						? ( 1 - state )
						: ( i === from ? state : 1 ),
					css = {
						zIndex: self.items.length + ( side === "left" ? to - i : i - to )
					},
					scale = ( 1 + ( ( 1 - mod ) * 0.3 ) ),
					matrixT, filters;

				css.left = (
					( -i * ( self.itemSize / 2 ) )
					+ ( side === "right"
						? -self.itemSize / 2
						: self.itemSize / 2
					) * mod
				);

				if( self.transformItems ) {
					// transponed matrix
					matrixT = [
						scale, ( mod * ( side === "right" ? -0.2 : 0.2 ) ),
						0, scale,
						0, 0
					];

					if( isOldie && ! $.support.transform ) {

						// Adapted from Paul Baukus transformie lib
						if( ! this.filters[ "DXImageTransform.Microsoft.Matrix" ] ) {
							this.style.filter = (this.style.filter ? "" : " " ) + "progid:DXImageTransform.Microsoft.Matrix(sizingMethod=\"auto expand\")";
						}
						filters = this.filters[ "DXImageTransform.Microsoft.Matrix" ];
						filters.M11 = matrixT[ 0 ];
						filters.M12 = matrixT[ 2 ];
						filters.M21 = matrixT[ 1 ];
						filters.M22 = matrixT[ 3 ];

					} else {
						css.transform = "matrix(" + matrixT.join( "," ) + ")";
					}
				}

				$( this ).css( css );

			});
		},
		_ui : function ( active, index ) {
			return {
				active: this.activeItem,
				index: index || this.currentIndex
			};
		},
		_onMouseWheel : function ( ev ) {
			var origEv = ev.originalEvent;

			ev.preventDefault();
			if( origEv.wheelDelta > 0 || origEv.detail < 0 ) {
				this.prev();
				return;
			}
			this.next();
		},
		_destroy : function () {

			this.element
				.attr( "style", this.origStyle )
				.removeClass( "ui-coverflow" )
				.parent()
				.removeClass( "ui-coverflow-wrapper ui-clearfix" );

			this.items.removeClass("ui-coverflow-item ui-state-active")
				.each(function(){
					$(this).attr("style", $(this).data("origstyle"));
				});

			this._super();
		}
	});

})( jQuery );
