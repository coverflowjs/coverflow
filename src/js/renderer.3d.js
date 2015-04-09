//>>excludeStart("buildExclude", pragmas.buildExclude);
if( $.coverflow == null ) {
	$.coverflow = {
		renderer : {},
		support : {}
	};
}
//>>excludeEnd("buildExclude");

function toRadian ( angle ) {
	return parseFloat( ( angle * 0.017453 ) .toFixed( 6 ) );
}

function ThreeDRenderer() {
	$.coverflow.renderer.Classic.apply( this, arguments );
}

ThreeDRenderer.prototype = {

	cssClass : "3d",

	initialize : function() {
		var me = this,
			css = {};

		me.itemSize = me.items
				.eq( me.widget.currentIndex )
				.outerWidth( true );

		me.outerWidth = me.element.parent().outerWidth( false );

		// make sure there's enough space
		css.width = me.itemSize * me.items.length;

		// Center the actual parents' left side within its parent
		$.extend(
			css,
			me._getCenterPosition(),
			me._getPerspectiveOrigin()
		);

		me.element
			.css( css );
	},
	getItemRenderedWidth : function () {

		var o = this.options;

		// Estimate the rendered width (not taking perspective into account)
		return Math.cos( toRadian( o.angle ) ) * this.itemSize * o.scale;
	},
	_getPerspectiveOrigin : function () {

		var me = this,
			o = me.options;

		// Center the perspective on the visual center of the container
		return {
			perspectiveOrigin : Math.round( me.itemSize / 2 +
				( me.widget.currentIndex *
					me.getItemRenderedWidth() *
					( 1 - o.overlap )
				) ) + "px " +
				o.perspectiveY + "%"
		};
	},
	_getCenterPosition : function () {
		var me = this,
			pos,
			renderedWidth = me.getItemRenderedWidth(),
			index = me.widget.currentIndex;

		// Get default center
		pos = ( me.outerWidth - me.itemSize ) / 2;

		// Shift left based on the number of elements before selection
		pos -= index * renderedWidth;

		// Adjust back right for the overlap of the elements
		pos += index * renderedWidth * me.options.overlap;

		// Adjust for the padding
		pos -= parseInt( me.element.css( "paddingLeft" ), 10 ) || 0;

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

		var me = this,
			transitionFn = $.coverflow.transition[ o.easing ] || $.coverflow.transition.easeOutQuint,
			css = {
				transitionProperty : "left",
				transitionDuration : o.duration + "ms",
				transitionTimingFunction : transitionFn,
				transitionDelay : "initial"
			};

		return $.extend(
				css,
				me._getCenterPosition(),
				me._getPerspectiveOrigin()
			);
	},
	refresh : function ( state, from, to ) {
		var me = this,
			o = me.options,
			itemLength = me.items.length,
			itemSize = me.itemSize,
			renderedWidth = me.getItemRenderedWidth();

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

			if( o.visibleAside > 0
				&& ( i < to - o.visibleAside
				|| i > to + o.visibleAside )
			) {
				css.visibility = "hidden";
			}

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

$.extend( $.coverflow.renderer, {
	ThreeD : ThreeDRenderer
});
