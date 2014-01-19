(function($) {

	module( 'CoverflowJS: offset', {
		setup: function() {
			this.el = $( '#qunit-fixture' ).find( '.coverflow' );
			this.items = this.el.children();
		},
		testRecurringCenterPosition : function( startPos ) {
			startPos = ~~ startPos;

			var offset = null,
				itemsLength = this.items.length,
				i = startPos + 1,
				el = this.el,
				runTest = function() {
					el
						.one( 'coverflowselect', function( ev, ui ) {

							equal( ui.active.offset().left, offset.left, 'active element recurring on initial left offset.' );
							equal( ui.active.offset().top, offset.top, 'active element recurring on initial top offset.' );

							if( i == itemsLength ) {
								start();
								return;
							}
							runTest();
						})
						.coverflow( 'select', i++ );
				};

			expect( ( itemsLength - 1 -startPos ) * 2 );

			this.el
				.one( 'coverflowselect', function( ev, ui ) {
					offset = ui.active.offset();
					runTest();
				})
				.coverflow({
					duration : 1,
					active : startPos
				});
		}
	});


	asyncTest( 'recurring item center position', function() {
		this.testRecurringCenterPosition(0);
	});

	asyncTest( 'recurring item center position with 2nd item as initial active item', function() {
		this.testRecurringCenterPosition(1);
	});

})( jQuery );
