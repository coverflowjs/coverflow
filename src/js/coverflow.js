/**
 * @license Released under the MIT license.
 *
 * CoverflowJS
 *
 * Refactored for jQuery 1.8 / jQueryUI 1.9 Sebastian Sauer
 * Re-written for jQueryUI 1.8.6/jQuery core 1.4.4+ by Addy Osmani with adjustments
 * Maintenance updates for 1.8.9/jQuery core 1.5, 1.6.2 made.
 * Original Component: Paul Bakaus for jQueryUI 1.7
 * 3D transformations: Brandon Belvin
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 *  jquery.ui.effect.js
 *  jquery.copycss.js
 *
 * - in case you want swipe support and you don't use jQuery mobile yet:
 * jquery-mobile.custom.js
 *
 * Events:
 *  beforeselect
 *  select
 */

(function( $, document, window ) {
	"use strict";

	/**
	 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	 * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	 *
	 * requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
	 * MIT license
	 *
	 * @see https://gist.github.com/paulirish/1579671
	 */

	var el = document.body || document.documentElement,
		style = el.style,
		lastTime = 0,
		vendors = [ "ms", "moz", "webkit", "o" ],
		vendorsLength = vendors.length,
		x = 0,
		capitalize = function( string ) {
			return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
		};

	for( ; x < vendorsLength && ! window.requestAnimationFrame; ++x ) {
		window.requestAnimationFrame = window[ vendors[ x ] + "RequestAnimationFrame" ];
		window.cancelAnimationFrame = window[ vendors[ x ] + "CancelAnimationFrame" ] ||
			window[ vendors[ x ] + "CancelRequestAnimationFrame" ];
	}

	if ( ! window.requestAnimationFrame ) {
		window.requestAnimationFrame = function( callback /* , element */ ) {
			var currTime = new Date().getTime(),
				timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) ),
				id = window.setTimeout( function() {
					callback( currTime + timeToCall );
				}, timeToCall );

			lastTime = currTime + timeToCall;

			return id;
		};
	}

	if ( ! window.cancelAnimationFrame ) {
		window.cancelAnimationFrame = function( id ) {
			clearTimeout(id);
		};
	}

	$.support.transform = "transform" in style ? "transform" : false;

	$.support.transition = "transition" in style ? "transition" : false;

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

})( jQuery, document, window );

(function( $, document, window ) {
	"use strict";

	function appendCamelCase () {
		/**
		 * @see http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
		 */
		function capitalizeFirstLetter( string ) {
			return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
		}

		var strings = [], i = 0;

		for ( ; i < arguments.length; i++ ) {
			if ( typeof arguments[ i ] === "string" && arguments[ i ].length > 0 ) {
				if ( strings.length > 0 ) {
					strings.push( capitalizeFirstLetter( arguments[ i ] ) );
				}
				else {
					strings.push( arguments[ i ] );
				}
			}
		}

		return strings.join( "" );
	}

	/**
	 * Determines the necessary CSS browser prefix. Defaults to "o" if no other found
	 * @see http://davidwalsh.name/vendor-prefix
	 */
	var browserPrefix = (function () {
		if ( ! window.getComputedStyle ) {
			// IE <= 8 doesn't support getComputedStyle and doesn't work with x-tags anyway
			return {
				css : "",
				js : ""
			};
		}

		var styles = window.getComputedStyle( document.documentElement, "" ),
			pre = ( Array.prototype.slice
				.call( styles )
				.join( "" )
				.match( /-(moz|webkit|ms)-/ ) || ( styles.OLink === "" && [ "", "o" ] )
			)[ 1 ];

		return {
			css : "-" + pre + "-",
			js : pre[ 0 ].toUpperCase() + pre.substr( 1 )
		};
	})(),
	availableCssTransitions = {

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
		"transition":     "transitionend",
		"MozTransition":  "transitionend",
		"OTransition":    "oTransitionEnd",
		"WebkitTransition": "webkitTransitionEnd",
		"msTransition":   "MSTransitionEnd"
	},
	isOldie = (function() {

		if( $.browser !== undefined ) {
			// old jQuery versions and jQuery migrate plugin users
			return $.browser.msie && ( ( ~~$.browser.version ) < 10 );
		}

		var match = /(msie) ([\w.]+)/.exec( navigator.userAgent.toLowerCase() );

		return match !== null && match[ 1 ] && ( ~~ match[ 2 ] ) < 10;
	})(),
	availableRenderers = {
		"3d" : {
			cssClass : "3d",
			options : {
				angle: 60,
				scale: 0.85,
				overlap: 0.3,
				perspectiveY: 45
			},
			_init : function ( that ) {
				var css = {};

				// make sure there's enough space
				css.width = that.itemWidth * that.items.length;

				// Center the actual parents' left side within its parent
				$.extend( css, this._getCenterPosition( that ), this._getPerspectiveOrigin( that ) );
				that.element.css( css );
			},
			_getItemRenderedWidth : function ( size, angle, scale ) {
				// Estimate the rendered width (not taking perspective into account)
				return Math.cos( angle * ( Math.PI / 180 ) ) * size * scale;
			},
			_getPerspectiveOrigin : function ( that ) {
				// Center the perspective on the visual center of the container
				return {
					perspectiveOrigin : that.itemSize / 2 +
						( that.currentIndex *
							this._getItemRenderedWidth( that.itemSize, this.options.angle, this.options.scale ) *
							( 1 - this.options.overlap )
						) + "px " +
						this.options.perspectiveY + "%"
				};
			},
			_getCenterPosition : function ( that, index ) {
				var pos,
					renderedWidth = this._getItemRenderedWidth( that.itemSize, this.options.angle, this.options.scale );

				index = typeof index === "undefined" ? that.currentIndex : index;

				// Get default center
				pos = that.outerWidth / 2 - that.itemSize / 2;

				// Shift left based on the number of elements before selection
				pos -= index * renderedWidth;

				// Adjust back right for the overlap of the elements
				pos += index * renderedWidth * this.options.overlap;

				// Adjust for the padding
				pos -= parseInt( that.element.css( "paddingLeft" ), 10 ) || 0;

				pos = Math.round( pos );

				return { left : pos };
			},
			select : function ( that, o ) {
				var animation = {
					coverflow : 1
				};

				$.extend( animation, this._getCenterPosition( that ), this._getPerspectiveOrigin( that ) );

				if( that.useJqueryAnimate ) {
					that._animation( o, animation );
					return true;
				}

				$.extend( animation, {
					duration: o.duration,
					easing: o.easing
				});

				that._transition( animation );
			},
			_transition : function ( that, o, from, to ) {
				// Query the element's active CSS in case a transition property is already defined
				var elementCss = $( that.element ).getStyles(),
					css = {},
					transitionFn = availableCssTransitions[ o.easing ] || availableCssTransitions.easeOutQuint,
					transitionPropertyName,
					activeProperty,
					propertyName,
					transition = {
						transitionProperty : "left",
						transitionDuration : o.duration + "ms",
						transitionTimingFunction : transitionFn,
						transitionDelay : "initial"
					};

				// TODO: Refactor to function
				$.each( [ "", browserPrefix.js ], function( i, prefix ) {
					transitionPropertyName = appendCamelCase.call( undefined, prefix, "transitionProperty" );

					activeProperty = elementCss[ transitionPropertyName ];
					if ( activeProperty ) {
						// Transition property already defined, check if the one we want to add is present
						if ( activeProperty.indexOf( transition.transitionProperty ) < 0 ) {

							// Add transition property since it is not yet included
							$.each( transition, function( name, value ) {
								propertyName = appendCamelCase.call( undefined, prefix, name );
								css[ propertyName ] = elementCss[ propertyName ] + ", " + value;
							});
						}
					} else {

						// Transition property not yet defined, add it
						$.each( transition, function( name, value ) {
							propertyName = appendCamelCase.call( undefined, prefix, name );
							css[ propertyName ] = value;
						});
					}
				});

				that.element
					.one( eventsMap[ $.support.transition ],
						function() {
							window.cancelAnimationFrame( that.coverflowrafid );

							that._refresh( 1, from, to );
							that._onAnimationEnd( that );
						}
					)
					.css( $.extend( css, this._getCenterPosition( that ),
						this._getPerspectiveOrigin( that ) ) );
			},
			_refresh : function ( that, state, from, to ) {
				var self = this,
					renderedWidth = self._getItemRenderedWidth( that.itemSize, self.options.angle, self.options.scale );

				that.items.each( function ( i ) {

					var side = ( ( i === to && from - to < 0 ) || i - to  > 0 ) ?
							"left" :
								"right",
						mod = ( i === to ) ?
							( 1 - state ) :
								( i === from ? state : 1 ),
						css = {
							zIndex: that.items.length + ( side === "left" ? to - i : i - to )
						},
						scale = 1 - ( mod * ( 1 - self.options.scale ) ),
						angle = side === "right" ? self.options.angle : - self.options.angle;

					// Adjust left to center active item in display window
					css.left = Math.round(
						-i * that.itemSize +
						( mod * i * renderedWidth * ( 1 - self.options.overlap ) ) +
						( ( 1 - mod ) * i * renderedWidth * ( 1 - self.options.overlap ) )
					);

					css.transform = "rotateY(" + ( mod * angle ) + "deg) scale(" + scale + ")";
					css.transformOrigin = side === "right" ? "left center" : "right center";

					$( this ).css( css );

				});
			}
		},
		classic : {
			cssClass : "classic",
			options : {
				stacking: 0.73
			},
			_init : function ( that ) {
				var o = that.options,
					css = {};

				o.stacking = parseFloat( o.stacking );
				this.options.stacking = o.stacking > 0 && o.stacking < 1 ?
					o.stacking :
					this.options.stacking;

				this.itemMargin = - Math.floor( ( 1 - o.stacking ) / 2 * that.items.innerWidth() );
				that.items
					// apply a negative margin so items stack
					.css({
						marginLeft : this.itemMargin,
						marginRight : this.itemMargin
					});

				// make sure there's enough space
				css.width = that.itemWidth * that.items.length;

				// Center the actual parent's left side within its parent
				$.extend( css, this._getCenterPosition( that ) );
				that.element.css( css );

				// Set up transformer
				this._transform = $.support.transform ? this._matrixTransform :
					isOldie ? this._fallbackTransform : $.noop;
			},
			_getCenterPosition : function ( that ) {
				var pos;

				pos = - that.currentIndex * that.itemSize / 2;
				pos += that.outerWidth / 2 - that.itemSize / 2;
				pos -= parseInt( that.element.css( "paddingLeft" ), 10 ) || 0;
				pos = Math.round( pos );

				return { left : pos };
			},
			select : function ( that, o ) {
				var animation = {
					coverflow : 1
				};

				$.extend( animation, this._getCenterPosition( that ) );

				if( that.useJqueryAnimate ) {
					that._animation( o, animation );
					return true;
				}

				$.extend( animation, {
					duration: o.duration,
					easing: o.easing
				});

				that._transition( animation );
			},
			_transition : function ( that, o, from, to ) {
				var self = this,
					transitionFn = availableCssTransitions[ o.easing ] || availableCssTransitions.easeOutQuint;

				that.element
					.one( eventsMap[ $.support.transition ],
						function() {
							cancelAnimationFrame( that.coverflowrafid );

							that._refresh( 1, from, to );
							that._onAnimationEnd( that );
						}
					)
					.css($.extend( self._getCenterPosition( that ), {
						"transition" : "left " + o.duration + "ms " + transitionFn
					}));
			},
			_refresh : function ( that, state, from, to ) {
				var self = this;

				that.items.each( function ( i ) {

					var side = ( ( i === to && from - to < 0 ) || i - to  > 0 )
							? "left"
							: "right",
						mod = ( i === to )
							? ( 1 - state )
							: ( i === from ? state : 1 ),
						css = {
							zIndex: that.items.length + ( side === "left" ? to - i : i - to )
						},
						scale = ( 1 + ( ( 1 - mod ) * 0.3 ) ),
						matrixT = [
							scale, ( mod * ( side === "right" ? -0.2 : 0.2 ) ),
							0, scale,
							0, 0
						];

					css.left = (
						( -i * ( that.itemSize / 2 ) )
						+ ( side === "right"
							? -that.itemSize / 2
							: that.itemSize / 2
						) * mod
					);

					self._transform.call( this, css, matrixT );

					$( this ).css( css );
				});
			},
			_matrixTransform : function ( css, matrixT ) {
				css.transform = "matrix(" + matrixT.join( "," ) + ")";
			},
			_fallbackTransform : function ( css, matrixT ) {
				// Adapted from Paul Baukus transformie lib
				if( ! this.filters[ "DXImageTransform.Microsoft.Matrix" ] ) {
					this.style.filter = (this.style.filter ? "" : " " ) + "progid:DXImageTransform.Microsoft.Matrix(sizingMethod=\"auto expand\")";
				}
				var filters = this.filters[ "DXImageTransform.Microsoft.Matrix" ];
				filters.M11 = matrixT[ 0 ];
				filters.M12 = matrixT[ 2 ];
				filters.M21 = matrixT[ 1 ];
				filters.M22 = matrixT[ 3 ];
			}
		}
	};

	$.widget( "ui.coverflow", {

		options: {
			items : "> *",
			active : 0,
			duration : 400,
			easing : "easeOutQuint",
			// selection triggers
			trigger : {
				itemfocus : true,
				itemclick : true,
				mousewheel : true,
				// If you want to use momentum swipe, make sure to set itemfocus: false
				swipe : true
			},
			renderer : "classic",
			swipefriction : 0.43
		},
		isTicking : false,
		_create : function () {

			var o = this.options;

			if ( ! $.support.transform || isOldie ) {
				// If transform is not supported or is old IE, force classic renderer
				this.renderer = availableRenderers.classic;
			} else {
				this.renderer = availableRenderers[ o.renderer ] || availableRenderers.classic;
			}

			this.renderer.options = $.extend( this.renderer.options, this.options.rendererOptions );

			this.elementOrigStyle = this.element.attr( "style" );

			this.items = this.element.find( o.items )
					.each( function () {
						var $this = $( this );
						$this.data({
							coverflowOrigElemAttr : {
								style : $this.attr( "style" ),
								class : $this.attr( "class" ),
								// Tab index is included here as attr, even though we call it as a prop because when you removeProp it sets it to 0 instead of actually removing
								tabIndex : $this.attr( "tabIndex" )
							}
						});
					})
					.addClass( "ui-coverflow-item" )
					// set tabindex so widget items get focusable
					// makes items accessible by keyboard
					.prop( "tabIndex", 0 );

			this.element
				.addClass( "ui-coverflow ui-coverflow-" + this.renderer.cssClass + "-render" )
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
				if ( o.trigger.swipe === "momentum" ) {
					// FIXME: Remove this override once jQuery Mobile 1.4 is launched
					$.event.special.swipe.handleSwipe = function( start, stop ) {
						if ( stop.time - start.time < $.event.special.swipe.durationThreshold &&
							Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > $.event.special.swipe.horizontalDistanceThreshold &&
							Math.abs( start.coords[ 1 ] - stop.coords[ 1 ] ) < $.event.special.swipe.verticalDistanceThreshold ) {

							start.origin.trigger( "swipe", { swipestart: start, swipestop: stop } )
								.trigger( start.coords[0] > stop.coords[ 0 ] ? "swipeleft" : "swiperight", { swipestart: start, swipestop: stop } );
						}
					};
					this._on({
						swipe: this._handleSwipe
					});
				} else {
					this._on({
						swipeleft: this.next,
						swiperight: this.prev
					});
				}
			}

			this.useJqueryAnimate = ! ( $.support.transition && $.isFunction( window.requestAnimationFrame ) );

			this.coverflowrafid = 0;
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

			this.itemWidth = this.items.width();
			this.itemHeight = this.items.height();
			this.itemSize = this.items.outerWidth( true );
			this.outerWidth = this.element.parent().outerWidth( false );

			// Call renderer-specific code
			this.renderer._init(this);

			// Jump to the first item
			this._refresh( 1, this._getFrom(), this.currentIndex );

			this.initialOffset = parseInt( this.activeItem.css( "left" ), 10 );

			this._trigger( "beforeselect", null, this._ui() );
			this._trigger( "select", null, this._ui() );
		},
		_getCenterPosition : function ( index ) {
			return this.renderer._getCenterPosition(this, index);
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
		_handleSwipe : function ( ev, data ) {
			// Handle the momentum-based swipe action
			// Based in-part on the formula used by iScroll 4
			var o = this.options,
				start = data.swipestart,
				stop = data.swipestop,
				time = stop.time - start.time,
				distance = stop.coords[ 0 ] - start.coords[ 0 ],
				speed = distance / time,
				direction = distance < 0 ? "left" : "right",
				destination = ~~ ( this.currentIndex + ( speed * speed ) /
					o.swipefriction * ( direction === "left" ? 1 : -1 ) );

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
				index = ! isNaN( parseInt( item, 10 ) ) ?
					parseInt( item, 10 ) :
						this.items.index( item );

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

			this.renderer.select(this, o);
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
					self._onAnimationEnd.apply( self );
				});
		},
		_transition : function( o ) {
			var self = this,
				d = new Date(),
				from = this._getFrom(),
				to = this.currentIndex,
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

			this.coverflowrafid = window.requestAnimationFrame( loopRefresh );

			this.renderer._transition(this, o, from, to);
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
			this.element
				.parent()
				.scrollTop( 0 );

			this.renderer._refresh( this, state, from, to );
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
				.removeClass( "ui-coverflow ui-coverflow-" + this.renderer.cssClass + "-render" )
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
						}
						else {
							$this.removeAttr( name );
						}
					});

					$this.data( "coverflowOrigElemAttr", null );
				});

			this._super();
		}
	});

})( jQuery, document, window );
