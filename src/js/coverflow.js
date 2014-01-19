/**
 * @license Released under the MIT license.
 *
 * CoverflowJS
 *
 * 3D transformations: Brandon Belvin
 * Refactored for jQuery 1.8 / jQueryUI 1.9 Sebastian Sauer
 * Re-written for jQueryUI 1.8.6/jQuery core 1.4.4+ by Addy Osmani with adjustments
 * Maintenance updates for 1.8.9/jQuery core 1.5, 1.6.2 made.
 * Original Component: Paul Bakaus for jQueryUI 1.7
 *
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 *
 * In case you want swipe support and you don't use jQuery mobile yet:
 * jquery-mobile.custom.js
 *
 * $.animate support for older browsers depends on:
 *  jquery.ui.effect.js
 *
 * Events:
 *  beforeselect
 *  select
 */

(function( $, document, window ) {

	"use strict";

	var eventsMap = {
			"transition":     "transitionend",
			"MozTransition":  "transitionend",
			"OTransition":    "oTransitionEnd",
			"WebkitTransition": "webkitTransitionEnd",
			"msTransition":   "transitionend"
		},
	isOldie = (function() {

		if( $.browser !== undefined ) {
			// old jQuery versions and jQuery migrate plugin users
			return $.browser.msie && ( ( ~~$.browser.version ) < 10 );
		}

		var match = /(msie) ([\w.]+)/.exec( navigator.userAgent.toLowerCase() );

		return match !== null && match[ 1 ] && ( ~~ match[ 2 ] ) < 10;
	})();

	$.coverflow = $.extend( true, {}, $.coverflow, {

		isAndroid : (/android/i).test( navigator.userAgent ),

		isOldie : isOldie,

		transition : {

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
		renderer : {}
	});

	$.widget( "ui.coverflow", {

		options: {
			items : "> *",
			active : 0,
			duration : 400,
			easing : "easeOutQuint",
			// renderer options
			// angle and perspective are only available when the browser supports 3d transformations
			angle: 45,
			perspectiveY: 45,
			scale: 0.7,
			overlap: 0.3,
			// selection triggers
			trigger : {
				itemfocus : false,
				itemclick : true,
				mousewheel : true,
				// if swipe is enabled, itemfocus will be set to false
				swipe : true
			}
		},
		isTicking : false,
		_create : function () {

			var o = this.options,
				Renderer,
				rendererOptions;

			this.elementOrigStyle = this.element.attr( "style" );

			this.items = this.element.find( o.items )
					.each( function () {
						var $this = $( this );
						$this.data({
							coverflowOrigElemAttr : {
								style : $this.attr( "style" ),
								"class" : $this.attr( "class" ),
								// Tab index is included here as attr, even though we call it as a prop because when you removeProp it sets it to 0 instead of actually removing
								tabIndex : $this.attr( "tabIndex" )
							}
						});
					})
					.addClass( "ui-coverflow-item" );

			this._setDimensions();

			if ( // transform is not supported
				! $.support.transform
				// or is old IE
				|| isOldie
				// or it's opera: fails to create a perspective on coverflow items
				|| window.opera != null
				// or no css3 transformation is available
				|| ! $.support.transform3d
			) {
				Renderer = $.coverflow.renderer.Classic;
			} else {
				Renderer = $.coverflow.renderer.ThreeD;
			}

			rendererOptions = {
				angle: o.angle,
				perspectiveY: o.perspectiveY,
				scale: o.scale,
				overlap: o.overlap,
				itemSize : this.itemSize,
				outerWidth : this.outerWidth
			};

			this.renderer = new Renderer(
					this,
					this.element,
					this.items,
					rendererOptions
				);

			this.element
				.addClass( "ui-coverflow ui-coverflow-" + this.renderer.cssClass + "-render" )
				.parent()
				.addClass( "ui-coverflow-wrapper ui-clearfix" );

			if( o.trigger.itemfocus ) {
				this._bindFocus();
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
				this._bindSwipe();
			}

			this.useJqueryAnimate = ! ( $.support.transition && $.isFunction( window.requestAnimationFrame ) );

			this.coverflowrafid = 0;
		},
		_bindFocus : function() {

			// set tabindex so widget items get focusable
			// makes items accessible by keyboard
			this.items
				.prop( "tabIndex", 0 );

			this._on( this.items, { focus : this._select });
		},
		_bindSwipe : function() {

			var $el = this.element,
				hasJqm = false,
				hasHammer = false;

			// jQuery mobile
			if( $.event.special && $.event.special.swipe ) {

				hasJqm = true;

				if( $.coverflow.isAndroid ) {
					$.event.special.swipe.scrollSupressionThreshold = 0;
				}

				$.event.special.swipe.handleSwipe = function( start, stop ) {

					var startPos = start.coords,
						endPos = stop.coords,
						swipeEv = $.event.special.swipe;

					if ( stop.time - start.time < swipeEv.durationThreshold &&
						Math.abs( startPos[ 0 ] - endPos[ 0 ] ) > swipeEv.horizontalDistanceThreshold &&
						Math.abs( startPos[ 1 ] - endPos[ 1 ] ) < swipeEv.verticalDistanceThreshold
					) {

						start.origin
							.trigger( "swipe", { swipestart: start, swipestop: stop } )
							.trigger(
								start.coords[0] > stop.coords[ 0 ]
									? "swipeleft"
									: "swiperight", { swipestart: start, swipestop: stop }
							);
					}
				};

				this._on({
					swipe: this._handleJQmSwipe
				});
			}

			// hammer.js
			if( $el.hammer && window.Hammer != null ) {

				hasHammer = true;

				$el
					.hammer()
					.on("drag swipe", function(ev) {

						// only horizontal swipe
						if( Hammer.utils.isVertical( ev.gesture.direction) ) {
						   return;
						}

						// prevent scrolling, so the drag/swipe handler is getting called
						// fix swipe on webkit based Android browsers
						ev.gesture.preventDefault();
					});

				this._on({
					swipe: this._handleHammerSwipe
				});
			}

			if( ! hasJqm && hasHammer ) {
				this._on({
					swipeleft : this.next,
					swiperight : this.prev
				});
			}
		},
		_init : function () {
			var o = this.options;

			o.duration = ~~ o.duration;
			if( o.duration < 1 ) {
				o.duration = 1;
			}

			this.currentIndex = this._isValidIndex( o.active, true ) ? o.active : 0;
			this.activeItem = this.items
				.removeClass( "ui-state-active" )
				.eq( this.currentIndex )
				.addClass( "ui-state-active" );

			this._setDimensions();

			// Call renderer-specific code
			this.renderer.initialize();

			// Jump to the first item
			this._refresh( 1, this._getFrom(), this.currentIndex );

			this._trigger( "beforeselect", null, this._ui() );
			this._trigger( "select", null, this._ui() );
		},
		_setDimensions : function() {

			this.itemWidth = this.items.width();

			this.itemHeight = this.items.height();

			this.itemSize = this.items.outerWidth( true );

			this.outerWidth = this.element.parent().outerWidth( false );
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
		_handleJQmSwipe : function ( ev, data ) {
			var start = data.swipestart,
				stop = data.swipestop,
				time = stop.time - start.time,
				distance = stop.coords[ 0 ] - start.coords[ 0 ],
				speed = distance / time,
				direction = distance < 0 ? "left" : "right";

			this._handleSwipe( direction, speed );
		},
		_handleHammerSwipe : function( ev ) {
			var gesture = ev.gesture;

			this._handleSwipe(
				gesture.direction,
				gesture.distance / gesture.deltaTime
			);
		},
		_handleSwipe : function( direction, speed ) {

			var delta = Math.pow( speed, 2 ),
				destination;

			// Handle the momentum-based swipe action
			// Based in-part on the formula used by iScroll 4
			//delta = this.element.hammer ? Math.log( delta ) : delta;
			delta = ~~ ( delta / ( direction === "left" ? 3 : - 3 ) );

			destination = this.currentIndex + delta;

			if ( destination === this.currentIndex ) {
				// If the swipe is short/slow enough to not move due to friction, treat it as a non-momentum swipe
				if ( direction === "left" ) {
					this.next();
				} else {
					this.prev();
				}
			} else if ( destination < 0 ) {
				// Can't scroll past first element, select first
				this.select( 0 );
			} else if ( this._isValidIndex( destination ) ) {
				// Destination is valid, select it
				this.select( destination );
			} else {
				// Otherwise, destination was past last item, select last
				this.select( this.items.length - 1 );
			}

		},
		_getFrom : function () {
			return Math.abs( this.previous - this.currentIndex ) <= 1 ?
				this.previousIndex :
					this.currentIndex + ( this.previousIndex < this.currentIndex ? -1 : 1 );
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
						window.cancelAnimationFrame( this.coverflowrafid );
					}

					this.element
						.unbind( eventsMap[ $.support.transition ] );
				}
			}
			this.isTicking = true;

			this.previousIndex = this.currentIndex;
			o.active = this.currentIndex = index;

			animation = $.extend( {}, this.renderer.select(), {
					coverflow : 1
				});

			if( this.useJqueryAnimate ) {

				this._animation( o, animation );
			} else {

				o = $.extend({
						duration: o.duration,
						easing: o.easing
					}, animation );

				this._transition( o );
			}

			return true;
		},
		_animation : function( o, animation ) {

			var self = this,
				from = this._getFrom();

			// Overwrite $.fx.step.coverflow everytime again with custom scoped values for this specific animation
			$.fx.step.coverflow = function( fx ) {
				self._refresh( fx.now, from, self.currentIndex );
			};

			// 1. Stop the previous animation
			// 2. Animate the parent's left/top property so the current item is in the center
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
					self._onAnimationEnd();
				});
		},
		_transition : function( o ) {
			var self = this,
				d = new Date(),
				from = this._getFrom(),
				to = this.currentIndex,
				styles = {},
				loopRefresh = function() {
					var state = ( (new Date()).getTime() - d.getTime() ) / o.duration;

					if( state > 1 ) {
						self.isTicking = false;
					} else {
						self._refresh( state, from, to );
					}

					if( self.isTicking ) {
						self.coverflowrafid = window.requestAnimationFrame( loopRefresh );
					}
				};


			if( $.isFunction( this.renderer.getElementTransitionStyles ) ) {
				styles = $.extend( styles, this.renderer.getElementTransitionStyles( o ) );
			}

			this.element
				.one( eventsMap[ $.support.transition ],
					function() {
						self._refresh( 1, from, to );
						self._onAnimationEnd();
					}
				)
				.css( styles );

			this.coverflowrafid = window.requestAnimationFrame( loopRefresh );
		},
		_onAnimationEnd : function() {

			if( this.coverflowrafid ) {
				cancelAnimationFrame( this.coverflowrafid );
			}

			this.isTicking = false;
			this.activeItem = this.items
					.removeClass( "ui-state-active" )
					.eq( this.currentIndex )
					.addClass( "ui-state-active" );

			// fire select after animation has finished
			this._trigger( "select", null, this._ui() );
		},
		_refresh: function( state, from, to ) {
			this.element
				.parent()
				.scrollTop( 0 );

			this.renderer.refresh( state, from, to );

		},
		_ui : function ( active, index ) {
			return {
				active: active || this.activeItem,
				// This is purposefully "!= null"
				index: index != null ? index : this.currentIndex
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
			if ( this.elementOrigStyle !== undefined ) {
				this.element.attr( "style", this.elementOrigStyle );
			} else {
				this.element.removeAttr( "style" );
			}

			this.element
				.removeClass(
					"ui-coverflow ui-helper-clearfix ui-coverflow-"
					+ ( this.renderer.cssClass || "classic" ) + "-render"
				)
				.parent()
				.removeClass( "ui-coverflow-wrapper ui-clearfix" );

			this.items
				.removeClass( "ui-coverflow-item ui-state-active" )
				.each(function(){
					var $this = $( this ),
						origAttr = $this.data( "coverflowOrigElemAttr" );

					$.each( origAttr, function( name, value ) {
						if ( value !== undefined ) {
							$this.attr( name, value );
						} else {
							$this.removeAttr( name );
						}
					});

					$this.data( "coverflowOrigElemAttr", null );
				});

			this._super();
		}
	});

})( jQuery, document, window );
