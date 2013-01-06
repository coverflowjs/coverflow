/*
 * jQuery UI CoverFlow II
 *
 * Refactored for jQuery 1.8 / jQueryUI 1.9 Sebastian Sauer
 * Re-written for jQueryUI 1.8.6/jQuery core 1.4.4+ by Addy Osmani with adjustments
 * Maintenance updates for 1.8.9/jQuery core 1.5, 1.6.2 made.
 * Original Component: Paul Bakaus for jQueryUI 1.7
 *
 * Released under the MIT license.
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 *  jquery.ui.effect.js
 *
 * Events:
 *  beforeselect
 *  select
 *  orientationchange
 */

(function( $ ) {

	if( $.support.transform != null ) {
		return;
	}

	if( typeof Modernizr !== "undefined" && Modernizr.csstransforms != null ) {
		$.support.transform = Modernizr.csstransforms;
		return;
	}

	var el = $( "<div />" ),
		style = el.get( 0 ).style,
		prefixes = 'Webkit Moz O ms'.split( ' ' );

	$.support.transform = 'transform' in style;

	if( ! $.support.transform ) {
		$.each( prefixes, function( i, p ) {
			if( p + 'Transform' in style ) {
				$.support.transform = true;
				// stop iteration
				return false;
			}
			return true;
		});
	}

	el.remove();

})( jQuery );

(function ( $ ) {

	var _capitalize = function( str ) {
		return str.charAt( 0 ).toUpperCase() + str.slice( 1 );
	};

	$.widget( "ui.coverflow", {

		options: {
			items: "> *",
			// item stacking - value 0>x<1
			stacking : 0.73,
			orientation: "horizontal",
			active: 0,
			duration : 200,
			easing: "easeOutQuint",
			// selection triggers
			trigger : {
				itemfocus : true,
				itemclick : true,
				mousewheel : true,
				swipe : true
			}
		},
		isTicking : false,

		_create: function () {

			var o = this.options;

			this.items = this.element.find( o.items );

			this.origElementDimensions = {
				width: this.element.width(),
				height: this.element.height()
			};

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
				this._on({
					swipeleft: this.next, //this._swipeLeft,
					swiperight: this.prev // this._swipeRight
				});
			}

		},
		_init : function () {

			var o = this.options,
				css = {};

			o.stacking = parseFloat( o.stacking );
			o.stacking = o.stacking > 0 && o.stacking < 1
				? o.stacking
				: 0.73;

			this.element
				.addClass( "ui-coverflow" )
				.parent()
				.addClass( "ui-coverflow-wrapper ui-clearfix" );

			this.itemMargin = - Math.floor( ( 1 - o.stacking ) / 2 * this.items.innerWidth() );

			this.currentIndex = this._isValidIndex( o.active ) ? o.active : 0;

			this.activeItem = this.items
				// apply a negative margin so items stack
				.css({
					margin : this.itemMargin
				})
				// set tabindex so widget items get focusable
				// makes items accessible by keyboard
				.addClass( 'ui-coverflow-item' )
				.prop( "tabIndex", 0 )
				.removeClass( 'ui-state-active' )
				.eq( this.currentIndex )
				.addClass( 'ui-state-active' );


			this.itemWidth = this.items.width();
			this.itemHeight = this.items.height();

			if( o.orientation === "vertical" ) {
				this._topOrLeft = "top";
				this._widthOrHeight = "height";
				if( this._orientation != null && this._orientation === "horizontal" ) {
					this._trigger( "orientationchange", null, this._ui() );
				}
				this._orientation = "vertical";
				this.itemSize = this.items.outerHeight( true );

				// make sure there's enough space
				css[ this._widthOrHeight ] = this.itemHeight * this.items.length;
			} else {
				this._topOrLeft = "left";
				this._widthOrHeight = "width";
				if( this._orientation != null && this._orientation === "vertical" ) {
					this._trigger( "orientationchange", null, this._ui() );
				}
				this._orientation = "horizontal";
				this.itemSize = this.items.outerWidth( true );

				// make sure there's enough space
				css[ this._widthOrHeight ] = this.itemWidth * this.items.length;
			}

			this.outerWidthOrHeight = ( this._widthOrHeight === "width" )
				? this.element.parent().outerWidth( false )
				: this.element.parent().outerHeight( false );

			//Center the actual parents' left side within it's parent
			$.extend( css, this._getCenterPosition() );
			this.element.css( css );

			//Jump to the first item
			this._refresh( 1, this._getFrom(), this.currentIndex );
			this._trigger( "select", null, this._ui() );
		},
		_getCenterPosition : function () {
			var animation = {},
				pos;

			pos = - this.currentIndex * this.itemSize / 2;
			pos += this.outerWidthOrHeight / 2 - this.itemSize / 2;
			pos -= parseInt( this.element.css('padding' + _capitalize( this._topOrLeft ) ) ,10 ) || 0;
			pos = Math.round( pos );

			animation[ this._topOrLeft ] = pos;

			return animation;
		},
		_isValidIndex : function ( index ) {

			index = ~~index;
			return this.currentIndex !== index && index > -1 && !! this.items.get( index );
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
		_getFrom : function () {
			return Math.abs( this.previous - this.currentIndex ) <= 1
				? this.previousIndex
				: this.currentIndex + ( this.previousIndex < this.currentIndex ? -1 : 1 );
		},
		select : function( item ) {

			var o = this.options,
				index = ! isNaN( parseInt( item, 10 ) )
					? parseInt( item, 10 )
					: this.items.index( item );

			if( ! this._isValidIndex( index ) || this.isTicking ) {
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

			this.previousIndex = this.currentIndex;
			this.currentIndex = index;

			var self = this,
				animation = {
					coverflow : 1
				},
				delta = this.previousIndex - this.currentIndex;

			$.extend( animation, this._getCenterPosition() );

			if( ! $.fn.transit || ! $.support.transition || true ) {
				this._animation( o, animation );
				return true;
			}

			$.extend( animation, {
				duration: o.duration,
				easing: o.easing
			});

			this._transition( animation );
			return true;
		},
		_animation : function( o, animation ) {

			var self = this,
				from = this._getFrom();

			//Overwrite $.fx.step.coverflow everytime again with custom scoped values for this specific animation
			$.fx.step.coverflow = function( fx ) {
				self._refresh( fx.now, from, self.currentIndex );
			};

			// 1. Stop the previous animation
			// 2. Animate the parent"s left/top property so the current item is in the center
			// 3. Use our custom coverflow animation which animates the item

			this.element
				// jump to end and release select trigger
				.stop( true, true )
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
				state = 0,
				from = this._getFrom(),
				to = this.currentIndex,
				loopRefresh = function() {
					var state = ( Date.now() - d.getTime() ) / o.duration;

					if( self.isTicking ) {
						requestAnimationFrame( loopRefresh );
					}
					if( state > 1 ) {
						self.isTicking = false;
					} else {
						self._refresh( state, from, to );
					}
				};

			this.isTicking = true;

			loopRefresh();

			this.element
				.transit({
						x : - this.currentIndex * this.itemSize / 2
					},
					o.duration,
					this.options.easing,
					function() {
						self._onAnimationEnd.apply( self );
						self.isTicking = false;
						self._refresh( 1, from, to );
					}
				);
		},
		_onAnimationEnd : function() {

			this.activeItem = this.items
					.removeClass( 'ui-state-active' )
					.eq( this.currentIndex )
					.addClass( 'ui-state-active' );
			// fire select after animation has finished
			this._trigger( "select", null, this._ui() );
		},
		_refresh: function( state, from, to ) {
			var self = this,
				offset = null;

			this.items.each( function ( i ) {

				var side = ( ( i === to && from - to < 0 ) || i - to  > 0 )
						? "left"
						: "right",
					mod = ( i === to )
						? ( 1 - state )
						: ( i === from ? state : 1 ),
					before = ( i > from && i !== to ),
					css = {
						zIndex: self.items.length + ( side === "left" ? to - i : i - to )
					},
					scale = ( 1 + ( ( 1 - mod ) * 0.3 ) ),
					matrixT, filters;

				css[ self._topOrLeft ] = (
					( -i * ( self.itemSize / 2 ) )
					+ ( side === "right"
						? -self.itemSize / 2
						: self.itemSize / 2
					) * mod
				);

				// transponed matrix
				matrixT = [
					scale, ( mod * ( side === "right" ? -0.2 : 0.2 ) ),
					0, scale,
					0, 0
				];

				if( ! $.support.transform && $.browser.msie ) {

					// Adapted from Paul Baukus transformie lib
					if( ! this.filters[ "DXImageTransform.Microsoft.Matrix" ] ) {
						this.style.filter = (this.style.filter ? '' : ' ' ) + "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand')";
					}
					filters = this.filters[ "DXImageTransform.Microsoft.Matrix" ];
					filters.M11 = matrixT[ 0 ];
					filters.M12 = matrixT[ 2 ];
					filters.M21 = matrixT[ 1 ];
					filters.M22 = matrixT[ 3 ];

				} else {
					css.transform = "matrix(" + matrixT.join( "," ) + ")";
				}

				$( this ).css( css );

			});

			this.element
				.parent()
				.scrollTop( 0 );

		},

		_ui : function ( active, index ) {
			return {
				active: this.activeItem,
				index: index || this.currentIndex
			};
		},
		_onMouseWheel : function ( ev ) {
			var origEv = ev.originalEvent;

			ev.preventDefault();

			if( origEv.wheelDelta > 0 || origEv.detail < 0 ) {
				this.next();
				return;
			}
			this.prev();
		},
		_destroy : function () {

			this.element
				.css( this.origElementDimensions )
				.removeClass( 'ui-coverflow' )
				.parent()
				.removeClass( 'ui-coverflow-wrapper' );

			this.items.each( function () {
				// TODO: needs testing
				// remove transform
				this.style = this.style.replace( /(webkit|moz|o|ms)?transform.*;/i, '' );
				// remove margin
				this.style = this.style.replace( /margin.*;/, '' );
			});

			this._superApply( "destroy", arguments );
		}

	});


})( jQuery );
