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
