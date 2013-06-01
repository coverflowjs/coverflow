/*! CoverflowJS - v2.3.0rc2 - 2013-06-01
* Copyright (c) 2008-2013 Paul Baukus, Addy Osmani, Sebastian Sauer; Licensed MIT */
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
		prefixes = [ "Webkit", "Moz", "O", "ms" ];

	$.support.transform = "transform" in style;

	if( ! $.support.transform ) {
		$.each( prefixes, function( i, p ) {
			if( p + "Transform" in style ) {
				$.support.transform = true;
				return false;
			}
			return true;
		});
	}
	el.remove();

})( jQuery );

(function( $ ) {

	$.widget( "ui.coverflow", {

		options: {
			items: "> *",
			// item stacking - value 0>x<1
			stacking : 0.73,
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

			this.items = this.element.find( o.items )
					// set tabindex so widget items get focusable
					// makes items accessible by keyboard
					.addClass( "ui-coverflow-item" )
					.prop( "tabIndex", 0 );

			this.element
				.addClass( "ui-coverflow" )
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
				this._on({
					swipeleft: this.next,
					swiperight: this.prev
				});
			}

			this.useJqueryAnimate = ! $.fn.transit
					|| ! $.support.transition
					|| ! $.isFunction( window.requestAnimationFrame );
		},
		_init : function () {

			var o = this.options,
				css = {};

			o.stacking = parseFloat( o.stacking );
			o.stacking = o.stacking > 0 && o.stacking < 1
				? o.stacking
				: 0.73;

			o.duration = ~~ o.duration;
			if( o.duration < 1 ) {
				o.duration = 1;
			}

			this.origElementDimensions = {
				width: this.element.width(),
				height: this.element.height()
			};

			this.itemMargin = - Math.floor( ( 1 - o.stacking ) / 2 * this.items.innerWidth() );
			this.currentIndex = this._isValidIndex( o.active, true ) ? o.active : 0;
			this.activeItem = this.items
				// apply a negative margin so items stack
				.css({
					marginLeft : this.itemMargin,
					marginRight : this.itemMargin
				})
				.removeClass( "ui-state-active" )
				.eq( this.currentIndex )
				.addClass( "ui-state-active" );

			this.itemWidth = this.items.width();
			this.itemHeight = this.items.height();
			this.itemSize = this.items.outerWidth( true );
			this.outerWidth = this.element.parent().outerWidth( false );

			// make sure there's enough space
			css.width = this.itemWidth * this.items.length;

			// Center the actual parents' left side within it"s parent
			$.extend( css, this._getCenterPosition() );
			this.element.css( css );

			// Jump to the first item
			this._refresh( 1, this._getFrom(), this.currentIndex );

			this.initialOffset = parseInt( this.activeItem.css( "left" ), 10 );

			this._trigger( "select", null, this._ui() );
		},
		_getCenterPosition : function () {
			var pos;

			pos = - this.currentIndex * this.itemSize / 2;
			pos += this.outerWidth / 2 - this.itemSize / 2;
			pos -= parseInt( this.element.css( "paddingLeft" ) ,10 ) || 0;
			pos = Math.round( pos );

			return { left : pos };
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
		_getFrom : function () {
			return Math.abs( this.previous - this.currentIndex ) <= 1
				? this.previousIndex
				: this.currentIndex + ( this.previousIndex < this.currentIndex ? -1 : 1 );
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

					if( this.element.data( "coverflowrafid" ) ) {
						cancelAnimationFrame( this.element.data( "coverflowrafid" ) );
					}

					this.element.transitionStop( true, false );

				}
			}
			this.isTicking = true;

			this.previousIndex = this.currentIndex;
			this.options.active = this.currentIndex = index;

			animation = {
				coverflow : 1
			};

			$.extend( animation, this._getCenterPosition() );

			if( this.useJqueryAnimate ) {
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

					if( self.isTicking ) {
						self.element
							.data( "coverflowrafid", requestAnimationFrame( loopRefresh ) );
					}
					if( state > 1 ) {
						self.isTicking = false;
					} else {
						self._refresh( state, from, to );
					}
				};

			this.element
				.data( "coverflowrafid", requestAnimationFrame( loopRefresh ) )
				.transit({
						x : - this.currentIndex * this.itemSize / 2 - this.initialOffset
					},
					o.duration,
					this.options.easing,
					function() {
						cancelAnimationFrame( self.element.data( "rafId" ) );
						self._refresh( 1, from, to );

						// apply animationend after last raf tick - otherwise Firefox fails randomly on offset unit testing
						setTimeout( function() {
							self._onAnimationEnd.apply( self );
						}, 0 );
					}
				);
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
			var self = this;

			this.element
				.parent()
				.scrollTop( 0 );

			this.items.each( function ( i ) {

				var side = ( ( i === to && from - to < 0 ) || i - to  > 0 )
						? "left"
						: "right",
					mod = ( i === to )
						? ( 1 - state )
						: ( i === from ? state : 1 ),
					css = {
						zIndex: self.items.length + ( side === "left" ? to - i : i - to )
					},
					scale = ( 1 + ( ( 1 - mod ) * 0.3 ) ),
					matrixT, filters;

				css.left = (
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

				if( ! $.support.transform ) {

					// Adapted from Paul Baukus transformie lib
					if( ! this.filters[ "DXImageTransform.Microsoft.Matrix" ] ) {
						this.style.filter = (this.style.filter ? "" : " " ) + "progid:DXImageTransform.Microsoft.Matrix(sizingMethod=\"auto expand\")";
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
				this.prev();
				return;
			}
			this.next();
		},
		_destroy : function () {

			this.element
				.css( this.origElementDimensions )
				.removeClass( "ui-coverflow" )
				.parent()
				.removeClass( "ui-coverflow-wrapper" );

			this.items.css({
				transform : "",
				marginLeft: 0,
				marginRight: 0
			});

			this._super();
		}
	});

})( jQuery );
