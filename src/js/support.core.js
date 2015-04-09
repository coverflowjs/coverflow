/**
 * extends jQuery.support by the following properties:
 *
 * - transform
 * - transition
 *
 * polyfills requestAnimationFrame/cancelAnimationFrame
 *
 * extends jQuery.cssProps:
 * - transitionProperty
 * - transitionDuration
 * - transitionTimingFunction
 * - transitionDelay
 * - perspectiveOrigin
 *
 */
//>>excludeStart("buildExclude", pragmas.buildExclude);
(function( $, window, document, undefined ) {

if( $.coverflow == null ) {
	$.coverflow = {
		renderer : {},
		support : {}
	};
}
//>>excludeEnd("buildExclude");

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
		support = $.coverflow.support,
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
		if( ! support.transform  && p + "Transform" in style ) {
			support.transform = p + "Transform";
		}
		if( ! support.transition && p + "Transition" in style ) {
			support.transition = p + "Transition";
		}

		if( support.transform && support.transition ) {
			vendorPrefix = p;
			return false;
		}
		return true;
	});

	if( ! support.transform || ! support.transition ) {

		support.transform = "transform" in style ? "transform" : false;
		support.transition = "transition" in style ? "transition" : false;
	}

	// expose feature support if not already set
	if( $.support.transform == null ) {
		$.support.transform = support.transform;
	}
	if( $.support.transition == null ) {
		$.support.transition = support.transition;
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

//>>excludeStart("buildExclude", pragmas.buildExclude);
})( jQuery, this, this.document );
//>>excludeEnd("buildExclude");
