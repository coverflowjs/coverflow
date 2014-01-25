function toRadian ( angle ) {
	return parseFloat( ( angle * 0.017453 ) .toFixed( 6 ) );
}

function ThreeDRenderer() {
	$.coverflow.renderer.Classic.apply( this, arguments );
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
