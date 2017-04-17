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

//>>excludeStart("buildExclude", pragmas.buildExclude);
(function( $, window, document, undefined ) {
//>>excludeEnd("buildExclude");

	function debounce( func, threshold ) {

		var timeout;

		return function() {
			var obj = this,
				args = arguments;

			if( timeout ) {
				clearTimeout( timeout );
			}

			timeout = setTimeout(function() {
						func.apply( obj, args );
						timeout = null;
					}, threshold
				);
		};
	}

	var eventsMap = {
			"transition":     "transitionend",
			"MozTransition":  "transitionend",
			"OTransition":    "oTransitionEnd",
			"WebkitTransition": "webkitTransitionEnd",
			"msTransition":   "transitionend"
		},
		userAgent = navigator.userAgent.toLowerCase(),
		isOldie = (function() {

			var match = /(msie) ([\w.]+)/.exec( userAgent );

			return match !== null && match[ 1 ] && ( ~~ match[ 2 ] ) < 10;
		})();

	$.coverflow = $.extend( true, {}, $.coverflow, {

		isAndroid : (/android/).test( userAgent ),

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
			visibleAside: null,
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

			var me = this,
				o = this.options,
				Renderer,
				rendererOptions,
				support = $.coverflow.support || {};

			me.elementOrigStyle = me.element.attr( "style" );

			me.items = me.element.find( o.items )
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

			me._setDimensions();

			me.support = support;

			if ( // transform is not supported
				! support.transform
				// or is old IE
				|| isOldie
				// or it's opera: fails to create a perspective on coverflow items
				|| window.opera != null
				// or no css3 transformation is available
				|| ! support.transform3d
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
				itemSize : me.itemSize,
				visibleAside: o.visibleAside !== null && ! isNaN( parseInt( o.visibleAside, 10 ) )
					? parseInt( o.visibleAside, 10 )
					: 0,
				outerWidth : me.outerWidth
			};

			me.renderer = new Renderer(
					me,
					me.element,
					me.items,
					rendererOptions
				);

			me.element
				.addClass( "ui-coverflow ui-coverflow-" + me.renderer.cssClass + "-render" )
				.parent()
				.addClass( "ui-coverflow-wrapper ui-clearfix" );

			if( o.trigger.itemfocus ) {
				this._bindFocus();
			}

			if( o.trigger.itemclick ) {
				me._on( me.items, { click : me._select });
			}

			if( o.trigger.mousewheel ) {
				me._on({
					wheel: debounce(me._onMouseWheel, 20),
					DOMMouseScroll: debounce(me._onMouseWheel, 20)
				});

				me._on({
					wheel: me._preventPageScroll,
					DOMMouseScroll: me._preventPageScroll
				});
			}

			if( o.trigger.swipe ) {
				me._bindSwipe();
			}

			me.useJqueryAnimate = ! ( support.transition && $.isFunction( window.requestAnimationFrame ) );

			me.coverflowrafid = 0;
		},
		_bindFocus : function() {
			var me = this;

			// set tabindex so widget items get focusable
			// makes items accessible by keyboard
			me.items
				.prop( "tabIndex", 0 );

			me._on( me.items, { focus : me._select });
		},
		_bindSwipe : function() {

			var me = this,
				$el = me.element,
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

				me._on({
					swipe : debounce( me._handleJQmSwipe, 150 )
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

				me._on({
					swipe: me._handleHammerSwipe
				});
			}

			if( ! hasJqm && ! hasHammer ) {
				me._on({
					swipeleft : me.next,
					swiperight : me.prev
				});
			}
		},
		_init : function () {
			var me = this,
				o = me.options;

			o.duration = ~~ o.duration;
			if( o.duration < 1 ) {
				o.duration = 1;
			}

			me.currentIndex = me._isValidIndex( o.active, true ) ? o.active : 0;
			me.activeItem = me.items
				.removeClass( "ui-state-active" )
				.eq( me.currentIndex )
				.addClass( "ui-state-active" );

			me._setDimensions();

			// Call renderer-specific code
			me.renderer.initialize();

			// Jump to the first item
			me._refresh( 1, me._getFrom(), me.currentIndex );

			me._trigger( "beforeselect", null, me._ui() );
			me._trigger( "select", null, me._ui() );
		},
		_setDimensions : function() {
			var me = this;

			me.itemWidth = me.items.width();

			me.itemHeight = me.items.height();

			me.itemSize = me.items.outerWidth( true );

			me.outerWidth = me.element.parent().outerWidth( false );
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

			var me = this,
				delta,
				destination;

			delta = me.outerWidth * ( Math.pow( speed, 2 ) ) * 0.25;
			delta /= me.itemWidth;
			delta = Math.floor( delta ) * ( direction === "left" ? 1 : -1 );

			destination = me.currentIndex + delta;

			if( ! delta ) {
				( direction === "left" ) ? me.next() : me.prev();
				return;
			}
			if( destination < 0 ) {
				me.select( 0 );
				return;
			}

			if( me._isValidIndex( destination ) ) {
				me.select( destination );
				return;
			}
			me.select( me.items.length - 1 );
		},
		_getFrom : function () {
			var me = this;

			return Math.abs( me.previous - me.currentIndex ) <= 1
				? me.previousIndex
				: me.currentIndex + ( me.previousIndex < me.currentIndex ? -1 : 1 );
		},
		select : function( item ) {

			var me = this,
				o = me.options,
				index = ! isNaN( parseInt( item, 10 ) )
						? parseInt( item, 10 )
						: me.items.index( item ),
				animation;

			if( ! me._isValidIndex( index ) ) {
				return false;
			}

			if( false === me._trigger(
					"beforeselect",
					null,
					this._ui(
						me.items.eq( index ), index
					)
				)
			) {
				return false;
			}

			if( me.isTicking ) {
				if( me.useJqueryAnimate ) {
					me.element.stop( true, false );
				} else {

					if( me.coverflowrafid ) {
						window.cancelAnimationFrame( me.coverflowrafid );
					}

					me.element
						.unbind( eventsMap[ me.support.transition ] );
				}
			}
			me.isTicking = true;

			me.previousIndex = me.currentIndex;
			o.active = me.currentIndex = index;

			animation = $.extend( {}, me.renderer.select(), {
					coverflow : 1
				});

			if( me.useJqueryAnimate ) {

				me._animation( o, animation );
			} else {

				o = $.extend({
						duration: o.duration,
						easing: o.easing
					}, animation );

				me._transition( o );
			}

			return true;
		},
		_animation : function( o, animation ) {

			var me = this,
				from = this._getFrom();

			// Overwrite $.fx.step.coverflow everytime again with custom scoped values for this specific animation
			$.fx.step.coverflow = function( fx ) {
				me._refresh( fx.now, from, me.currentIndex );
			};

			// 1. Stop the previous animation
			// 2. Animate the parent's left/top property so the current item is in the center
			// 3. Use our custom coverflow animation which animates the item

			me.element
				.animate(
					animation,
					{
						duration: o.duration,
						easing: o.easing
					}
				)
				.promise()
				.done(function() {
					me._onAnimationEnd();
				});
		},
		_transition : function( o ) {
			var me = this,
				d = new Date(),
				from = me._getFrom(),
				to = me.currentIndex,
				styles = {},
				loopRefresh = function() {
					var state = ( (new Date()).getTime() - d.getTime() ) / o.duration;

					if( state > 1 ) {
						me.isTicking = false;
					} else {
						me._refresh( state, from, to );
					}

					if( me.isTicking ) {
						me.coverflowrafid = window.requestAnimationFrame( loopRefresh );
					}
				};


			if( $.isFunction( me.renderer.getElementTransitionStyles ) ) {
				styles = $.extend( styles, me.renderer.getElementTransitionStyles( o ) );
			}

			me.element
				.one( eventsMap[ me.support.transition ],
					function() {
						me._refresh( 1, from, to );
						me._onAnimationEnd();
					}
				)
				.css( styles );

			me.coverflowrafid = window.requestAnimationFrame( loopRefresh );
		},
		_onAnimationEnd : function() {

			var me = this;

			if( me.coverflowrafid ) {
				cancelAnimationFrame( me.coverflowrafid );
			}

			me.isTicking = false;
			me.activeItem = me.items
					.removeClass( "ui-state-active" )
					.eq( me.currentIndex )
					.addClass( "ui-state-active" );

			// fire select after animation has finished
			me._trigger( "select", null, me._ui() );
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
				index: index != null ? index : this.currentIndex
			};
		},
		_preventPageScroll : function(ev) {
			ev.preventDefault();
		},
		_onMouseWheel : function ( ev ) {
			var origEv = ev.originalEvent, delta;
			if (typeof origEv.deltaMode !== 'undefined') {
				delta = Math.abs(origEv.deltaX) > Math.abs(origEv.deltaY) ? -origEv.deltaX : -origEv.deltaY;
				// mac os specific - fighting trackpad clumsy scrolling behaviour
				if (origEv.deltaMode === window.WheelEvent.DOM_DELTA_PIXEL && delta > -10 && delta < 3) {
					return;
				}
			} else {
				delta = Math.abs(origEv.wheelDelta) > 0 ? origEv.wheelDelta : -origEv.detail;

				// mac os specific - fighting trackpad clumsy scrolling behaviour
				if( delta > -10 && delta < 3 ) {
					return;
				}
			}


			if( delta > 0 ) {
				this.prev();
				return;
			}
			this.next();
		},
		_destroy : function () {

			var me = this;

			if ( me.elementOrigStyle !== undefined ) {
				me.element.attr( "style", this.elementOrigStyle );
			} else {
				me.element.removeAttr( "style" );
			}

			me.element
				.removeClass(
					"ui-coverflow ui-helper-clearfix ui-coverflow-"
					+ ( me.renderer.cssClass || "classic" ) + "-render"
				)
				.parent()
				.removeClass( "ui-coverflow-wrapper ui-clearfix" );

			me.items
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

			me._super();
		}
	});

//>>excludeStart("buildExclude", pragmas.buildExclude);
})( jQuery, this, this.document );
//>>excludeEnd("buildExclude");
