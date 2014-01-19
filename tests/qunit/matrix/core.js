(function($) {

	module( 'CoverflowJS: core', {
		setup: function() {
			this.el = $( '#qunit-fixture' ).find( '.coverflow' );
			this.items = this.el.children();

			this.el
				.coverflow({
					active : 0,
					duration : 1,
					trigger : {
						"itemfocus" : true
					}
				});
		}
	});

	test( 'widget core', 2, function() {
		deepEqual( this.el, this.el.coverflow(), 'method is chainable' );
		deepEqual( this.el.get( 0 ), this.el.coverflow( 'widget' ).get( 0 ), 'widget method' );
	});

	asyncTest( 'focus tabbable', 22, function() {
		var items = this.items,
			itemsLength = items.length,
			i = 1;

		this.el
			.on( 'coverflowselect', function( ev, ui ) {
				strictEqual( i++ , ui.index, 'focused item ' + ( ui.index + 1 ) );

				equal( document.activeElement, ui.active.get( 0 ),
					'active element matches ui.active' );

				if( ui.index < ( itemsLength - 1 ) ) {
					items
						.eq( ++ui.index )
						.focus();
					return;
				}
				start();
			});

		items
			.eq( 1 )
			.focus();

	});

})( jQuery );
