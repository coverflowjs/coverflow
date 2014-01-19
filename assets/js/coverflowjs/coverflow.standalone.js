/*! CoverflowJS - v3.0.0rc3 - 2014-01-19
* Copyright (c) 2008-2014 Paul Baukus, Addy Osmani, Sebastian Sauer, Brandon Belvin, April Barrett; Licensed MIT */
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

	var el = document.createElement( "div" ),
		style = el.style,
		lastTime = 0,
		vendors = [ "ms", "moz", "webkit", "o" ],
		vendorsLength = vendors.length,
		vendorPrefix = "",
		x = 0,
		capitalize = function( string ) {
			return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
		};

	for( ; x < vendorsLength && ! window.requestAnimationFrame; x++ ) {
		window.requestAnimationFrame = window[ vendors[ x ] + "RequestAnimationFrame" ];
		window.cancelAnimationFrame = window[ vendors[ x ] + "CancelAnimationFrame" ] ||
			window[ vendors[ x ] + "CancelRequestAnimationFrame" ];
	}

	if ( ! window.requestAnimationFrame ) {
		window.requestAnimationFrame = function( callback ) {
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
			clearTimeout( id );
		};
	}

	// Check for vendor prefixed support of transition events first
	// Some Webkit browsers on Android are providing false positives
	// on non-prefixed transition event handlers
	// e.g. Webkit on Galaxy Tab II
	$.each( vendors, function( i, p ) {

		if( p !== "ms" ) {
			p = capitalize( p );
		}
		if( ! $.support.transform  && p + "Transform" in style ) {
			$.support.transform = p + "Transform";
		}
		if( ! $.support.transition && p + "Transition" in style ) {
			$.support.transition = p + "Transition";
		}

		if( $.support.transform && $.support.transition ) {
			vendorPrefix = p;
			return false;
		}
		return true;
	});

	if( ! $.support.transform || ! $.support.transition ) {

		$.support.transform = "transform" in style ? "transform" : false;
		$.support.transition = "transition" in style ? "transition" : false;
	}

	if( $.cssProps == null ) {
		throw new Error( "Your jQuery version is too old. Please upgrade." );
	}

	if( !! vendorPrefix ) {

		$.each([
				"transitionProperty",
				"transitionDuration",
				"transitionTimingFunction",
				"transitionDelay",
				"perspectiveOrigin"
			], function( i, cssProperty ) {

				if( $.cssProps[ cssProperty ] != null ) {
					return;
				}

				$.cssProps[ cssProperty ] = vendorPrefix + capitalize( cssProperty );
			});
	}

	el = null;

})( jQuery, document, window );

(function( window, document, undefined ) {

    var docElement = document.documentElement,

        mod = "coverflowjsfeaturedetection",
        modElem = document.createElement( mod ),
        mStyle = modElem.style,

        omPrefixes = "Webkit Moz O ms",

        cssomPrefixes = omPrefixes.split( " " ),

        domPrefixes = omPrefixes.toLowerCase().split( " " ),

        slice = ([]).slice,

        injectElementWithStyles = function( rule, callback, nodes, testnames ) {

            var style, ret, node, docOverflow,
                div = document.createElement( "div" ),
                body = document.body,
                fakeBody = body || document.createElement( "body" );

            if( parseInt( nodes, 10 ) ) {
                while( nodes-- ) {
                    node = document.createElement( "div" );
                    node.id = testnames ? testnames[ nodes ] : mod + ( nodes + 1 );
                    div.appendChild(node);
                }
            }

            style = [ "&#173;", "<style id='s", mod, "'>", rule, "</style>" ].join( "" );
            div.id = mod;
            ( body ? div : fakeBody ).innerHTML += style;
            fakeBody.appendChild(div);
            if( ! body ) {
                fakeBody.style.background = "";
                fakeBody.style.overflow = "hidden";
                docOverflow = docElement.style.overflow;
                docElement.style.overflow = "hidden";
                docElement.appendChild( fakeBody );
            }

            ret = callback( div, rule );
            if( ! body ) {
                fakeBody.parentNode.removeChild( fakeBody );
                docElement.style.overflow = docOverflow;
            } else {
                div.parentNode.removeChild(div);
            }

            return !!ret;

        },

        _hasOwnProperty = ({}).hasOwnProperty,
        hasOwnProp;

	function is( obj, type ) {
        return typeof obj === type;
    }

    if( ! is( _hasOwnProperty, "undefined" ) && ! is( _hasOwnProperty.call, "undefined" ) ) {
        hasOwnProp = function( object, property ) {
            return _hasOwnProperty.call(object, property);
        };
    } else {
        hasOwnProp = function( object, property ) {
            return ( ( property in object ) && is( object.constructor.prototype[ property ], "undefined"));
        };
    }


    if( ! Function.prototype.bind) {

		Function.prototype.bind = function bind( that ) {

            var target = this,
				args, bound;

            if( ! $.isFunction( target ) ) {
                throw new TypeError();
            }

            args = slice.call( arguments, 1 );
			bound = function() {

				if( this instanceof bound ) {

					var F = function() {},
						self, result;

					F.prototype = target.prototype;
					self = new F();

					result = target.apply(
						self,
						args.concat( slice.call( arguments ) )
					);
					if( Object( result ) === result) {
						return result;
					}
					return self;

				} else {

					return target.apply(
						that,
						args.concat( slice.call( arguments ) )
					);

				}

			};

            return bound;
        };
    }

    function contains( str, substr ) {
        return !!~( "" + str ).indexOf( substr );
    }

    function testProps( props, prefixed ) {

		var i, prop;

		for( i in props ) {
            prop = props[ i ];
            if( ! contains( prop, "-" ) && mStyle[ prop ] !== undefined) {
                return prefixed === "pfx" ? prop : true;
            }
        }
        return false;
    }

    function testDOMProps( props, obj, elem ) {

		var i, item;

		for( i in props ) {
            item = obj[ props[ i ] ];
            if( item !== undefined) {

                if( elem === false) {
					return props[ i ];
                }

                if( is( item, "function" ) ) {
                    return item.bind( elem || obj );
                }

                return item;
            }
        }
        return false;
    }

    function testPropsAll(prop, prefixed, elem) {

        var ucProp = prop.charAt( 0 ).toUpperCase() + prop.slice( 1 ),
            props = ( prop + " " + cssomPrefixes.join( ucProp + " " ) + ucProp).split( " " );

        if( is( prefixed, "string" ) || is( prefixed, "undefined" ) ) {
            return testProps( props, prefixed );

        } else {
            props = ( prop + " " + ( domPrefixes ).join( ucProp + " " ) + ucProp ).split( " " );
            return testDOMProps( props, prefixed, elem );
        }
    }

    $.support.transform3d = (function() {

        var ret = !! testPropsAll( "perspective" );

        if( ret && "webkitPerspective" in docElement.style ) {

            injectElementWithStyles(
				"@media (transform-3d),(-webkit-transform-3d){#coverflowjsfeaturedetection{left:9px;position:absolute;height:3px;}}",
				function( node )
			{
                ret = node.offsetLeft === 9 && node.offsetHeight === 3;
            });
        }
        return ret;
    })();


})(this, this.document);

function ClassicRenderer( widget, element, items, options ) {

	this.widget = widget;

	this.element = element || $();

	this.items = items || $();

	this.options = options;

}

ClassicRenderer.prototype = {

	cssClass : "classic",

	itemMargin : 0,

	initialize : function() {
		var o = this.options,
			css = {},
			$activeItem = this.items
				.eq( this.widget.currentIndex );

		this.itemSize = $activeItem.width();

		this.outerWidth = this.element.parent().outerWidth( false );

		this.itemMargin = - Math.floor( o.overlap / 2 * $activeItem.innerWidth() );

		this.items
			// apply a negative margin so items overlap
			.css({
				marginLeft : this.itemMargin,
				marginRight : this.itemMargin
			});

		// make sure there's enough space
		css.width = this.items.width() * this.items.length;

		// Center the actual parent's left side within its parent
		$.extend( css, this._getCenterPosition() );
		this.element.css( css );
	},
	getItemRenderedWidth : function() {
		return this.itemSize;
	},
	_getCenterPosition : function () {
		var pos,
			itemSize = this.itemSize,
			index = this.widget.currentIndex;

		pos = ( this.outerWidth - itemSize ) / 2;
		pos -= index * this.itemSize / 2;
		pos += parseInt( this.element.css( "paddingLeft" ), 10 ) || 0;
		pos -= index * this.itemMargin * 2;

		pos -= this.itemMargin;
		pos = Math.round( pos );

		return { left : pos };
	},
	select : function () {
		return this._getCenterPosition();
	},
	getElementTransitionStyles : function( o ) {

		var transitionFn = $.coverflow.transition[ o.easing ] || $.coverflow.transition.easeOutQuint;
		return $.extend( this._getCenterPosition(), {
					"transition" : "left " + o.duration + "ms " + transitionFn
				});
	},
	refresh : function ( state, from, to ) {
		var self = this,
			o = this.options,
			itemLength = this.items.length,
			itemSize = this.itemSize,
			itemMargin = this.itemMargin;

		this.items.each( function ( i ) {

			var side = ( ( i === to && from - to < 0 ) || i - to  > 0 )
					? "left"
					: "right",
				mod = ( i === to )
					? ( 1 - state )
					: ( i === from ? state : 1 ),
				css = {
					zIndex: itemLength + ( side === "left" ? to - i : i - to ) + 10
				},
				scale = ( 1 - mod * ( 1 - o.scale )  ),
				matrixT = [
					scale, ( mod * ( side === "right" ? -0.15 : 0.15 ) ),
					0, scale,
					0, 0
				];

			css.left = (
				( -i * ( itemSize / 2 ) )
				+ ( side === "right"
					? - itemSize / 2 + ( itemSize / 2 * o.overlap )
					: itemSize / 2 - ( itemSize / 2 * o.overlap )
				) * mod
			);

			if( $.coverflow.isOldie && i === to ) {
				css.left += itemMargin;
				css.top = Math.ceil( itemMargin / 2 );
			}

			self._transform( this, css, matrixT );

			$( this ).css( css );
		});
	},
	_transform : function() {

		if( $.support.transform ) {
			this._matrixTransform.apply( this, arguments );
			return;
		}
		if( $.coverflow.isOldie ) {
			this._fallbackTransform.apply( this, arguments );
		}
	},
	_matrixTransform : function ( el, css, matrixT ) {
		css.transform = "matrix(" + matrixT.join( "," ) + ")";
	},
	_fallbackTransform : function ( el, css, matrixT ) {
		// Adapted from Paul Baukus transformie lib
		if( ! el.filters[ "DXImageTransform.Microsoft.Matrix" ] ) {
			el.style.filter = (el.style.filter ? "" : " " ) + "progid:DXImageTransform.Microsoft.Matrix(sizingMethod=\"auto expand\")";
		}
		var filters = el.filters[ "DXImageTransform.Microsoft.Matrix" ];
		filters.M11 = matrixT[ 0 ];
		filters.M12 = matrixT[ 2 ];
		filters.M21 = matrixT[ 1 ];
		filters.M22 = matrixT[ 3 ];
	}
};

if( $.coverflow == null ) {
	$.coverflow = {
		renderer : {}
	};
}

$.extend( $.coverflow.renderer, {
	Classic : ClassicRenderer
});

function toRadian ( angle ) {
	return parseFloat( ( angle * 0.017453 ) .toFixed( 6 ) );
}

function ThreeDRenderer( widget, element, items, options ) {

	this.widget = widget;

	this.element = element || $();

	this.items = items || $();

	this.options = options;
}

ThreeDRenderer.prototype = {

	cssClass : "3d",

	initialize : function() {
		var css = {};

		this.itemSize = this.items
				.eq( this.widget.currentIndex )
				.outerWidth( true );

		this.outerWidth = this.element.parent().outerWidth( false );

		// make sure there's enough space
		css.width = this.itemSize * this.items.length;

		// Center the actual parents' left side within its parent
		$.extend(
			css,
			this._getCenterPosition(),
			this._getPerspectiveOrigin()
		);

		this.element
			.css( css );
	},
	getItemRenderedWidth : function () {

		var o = this.options;

		// Estimate the rendered width (not taking perspective into account)
		return Math.cos( toRadian( o.angle ) ) * this.itemSize * o.scale;
	},
	_getPerspectiveOrigin : function () {

		var o = this.options;

		// Center the perspective on the visual center of the container
		return {
			perspectiveOrigin : Math.round( this.itemSize / 2 +
				( this.widget.currentIndex *
					this.getItemRenderedWidth() *
					( 1 - o.overlap )
				) ) + "px " +
				o.perspectiveY + "%"
		};
	},
	_getCenterPosition : function () {
		var pos,
			renderedWidth = this.getItemRenderedWidth(),
			index = this.widget.currentIndex;

		// Get default center
		pos = ( this.outerWidth - this.itemSize ) / 2;

		// Shift left based on the number of elements before selection
		pos -= index * renderedWidth;

		// Adjust back right for the overlap of the elements
		pos += index * renderedWidth * this.options.overlap;

		// Adjust for the padding
		pos -= parseInt( this.element.css( "paddingLeft" ), 10 ) || 0;

		pos = Math.round( pos );

		return { left : pos };
	},
	select : function () {

		return $.extend(
			{},
			this._getCenterPosition(),
			this._getPerspectiveOrigin()
		);
	},
	getElementTransitionStyles : function ( o ) {

		var transitionFn = $.coverflow.transition[ o.easing ] || $.coverflow.transition.easeOutQuint,
			css = {
				transitionProperty : "left",
				transitionDuration : o.duration + "ms",
				transitionTimingFunction : transitionFn,
				transitionDelay : "initial"
			};

		$.extend(
				css,
				this._getCenterPosition(),
				this._getPerspectiveOrigin()
			);

		this.element
			.css( css );
	},
	refresh : function ( state, from, to ) {
		var self = this,
			o = self.options,
			itemLength = self.items.length,
			itemSize = this.itemSize,
			renderedWidth = self.getItemRenderedWidth();

		this.items.each( function ( i ) {

			var side = ( ( i === to && from - to < 0 ) || i - to  > 0 )
					? "left"
					: "right",
				mod = ( i === to )
					? ( 1 - state )
					: ( i === from ? state : 1 ),
				css = {
					zIndex: itemLength + ( side === "left" ? to - i : i - to ) + 10
				},
				scale = 1 - ( mod * ( 1 - o.scale ) ),
				angle = side === "right" ? o.angle : - o.angle,
				matrixT;

			angle = toRadian( mod * angle );

			// Adjust left to center active item in display window
			css.left = Math.round(
				-i * itemSize +
				( mod * i * renderedWidth * ( 1 - o.overlap ) ) +
				( ( 1 - mod ) * i * renderedWidth * ( 1 - o.overlap ) )
			);

			// transponed matrix
			matrixT = [
				( scale * Math.cos( angle ) ).toFixed( 6 ), 0,     Math.sin( -angle ).toFixed( 6 ),           0,
				0,                                          scale, 0,                                         0,
				Math.sin( angle ).toFixed( 6 ),             0,     ( scale * Math.cos( angle )).toFixed( 6 ), 0,
				0,                                          0,     0,                                         1
			];

			css.transform = "matrix3d(" + matrixT.join( ", ") + ")";
			css.transformOrigin = side === "right" ? "left center" : "right center";

			$( this ).css( css );
		});
	}
};

if( $.coverflow == null ) {
	$.coverflow = {
		renderer : {}
	};
}

$.extend( $.coverflow.renderer, {
	"ThreeD" : ThreeDRenderer
});

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
