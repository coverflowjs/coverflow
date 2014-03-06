/*
 * Detect support for 3d css transformations
 * Based on Modernizr 2.7.1 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-csstransforms3d-addtest-prefixed-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes
 */
//>>excludeStart("buildExclude", pragmas.buildExclude);

if( $.coverflow == null ) {
	$.coverflow = {
		renderer : {},
		support : {}
	};
}

(function( $, window, document, undefined ) {
//>>excludeEnd("buildExclude");

    var docElement = document.documentElement,

        mod = "coverflowjsfeaturedetection",
        modElem = document.createElement( mod ),
        mStyle = modElem.style,

        omPrefixes = "Webkit Moz O ms",

        cssomPrefixes = omPrefixes.split( " " ),

        domPrefixes = omPrefixes.toLowerCase().split( " " ),

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
                    return $.proxy( item, elem || obj );
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

    $.coverflow.support.transform3d = (function() {

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

	// expose feature support if not already set
    if( $.support.transform3d == null ) {
	    $.support.transform3d = $.coverflow.support.transform3d;
    }

//>>excludeStart("buildExclude", pragmas.buildExclude);
})( jQuery, this, this.document );
//>>excludeEnd("buildExclude");
