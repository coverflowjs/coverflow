//>>excludeStart("buildExclude", pragmas.buildExclude);
if( $.coverflow == null ) {
	$.coverflow = {
		renderer : {},
		support : {}
	};
}
//>>excludeEnd("buildExclude");

function ClassicRenderer( widget, element, items, options ) {

	var me = this;

	me.widget = widget;

	me.element = element;

	me.items = items;

	me.options = options;

}

ClassicRenderer.prototype = {

	cssClass : "classic",

	itemMargin : 0,

	initialize : function() {

		var me = this,
			o = me.options,
			css = {},
			$activeItem = me.items
				.eq( me.widget.currentIndex );

		me.itemSize = $activeItem.width();

		me.outerWidth = me.element.parent().outerWidth( false );

		me.itemMargin = - Math.floor( o.overlap / 2 * $activeItem.innerWidth() );

		me.items
			// apply a negative margin so items overlap
			.css({
				marginLeft : me.itemMargin,
				marginRight : me.itemMargin
			});

		// make sure there's enough space
		css.width = me.items.width() * me.items.length;

		// Center the actual parent's left side within its parent
		$.extend( css, me._getCenterPosition() );
		me.element.css( css );
	},
	_getCenterPosition : function () {
		var me = this,
			pos,
			itemSize = me.itemSize,
			index = me.widget.currentIndex;

		pos = ( me.outerWidth - itemSize ) / 2;
		pos -= index * me.itemSize / 2;
		pos += parseInt( me.element.css( "paddingLeft" ), 10 ) || 0;
		pos -= index * me.itemMargin * 2;

		pos -= me.itemMargin;
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
		var me = this,
			o = me.options,
			itemLength = me.items.length,
			itemSize = me.itemSize,
			itemMargin = me.itemMargin;

		this.items.each( function ( i ) {

			var side = ( ( i === to && from - to < 0 ) || i - to  > 0 )
					? "left"
					: "right",
				mod = ( i === to )
					? ( 1 - state )
					: ( i === from ? state : 1 ),
				css = {
					zIndex: itemLength + ( side === "left" ? to - i : i - to ) + 10,
					visibility: "visible"
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

			if( o.visibleAside > 0
				&& ( i < to - o.visibleAside
				|| i > to + o.visibleAside )
			) {
				css.visibility = "hidden";
			}

			if( $.coverflow.isOldie ) {
				if( i === to ) {
					css.left += itemMargin;
					css.top = 0;
				} else {
					css.top = Math.ceil( -itemMargin / 2 );
				}
			}

			me._transform( this, css, matrixT );

			$( this ).css( css );
		});
	},
	_transform : function() {

		var me = this;

		if( $.coverflow.support.transform ) {
			me._matrixTransform.apply( me, arguments );
			return;
		}
		if( $.coverflow.isOldie ) {
			me._fallbackTransform.apply( me, arguments );
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

$.extend( $.coverflow.renderer, {
	Classic : ClassicRenderer
});
