(function($) {

	function getAttributes( $elem ) {
		var attrs = {};
		$.each( $elem[ 0 ].attributes, function () {
			attrs[ this.nodeName ] = this.nodeValue;
		});
		return attrs;
	}

	module( 'CoverflowJS: methods', {
		setup: function() {
			this.el = $( '#qunit-fixture' ).find( '.coverflow' );
			this.items = this.el.children();
		}
	});

	test( 'widget core', 2, function() {
		deepEqual( this.el, this.el.coverflow(), 'method is chainable' );
		deepEqual( this.el.get( 0 ), this.el.coverflow( 'widget' ).get( 0 ), 'widget method' );
	});

	test( 'destroy', 20, function () {
		var originalAttrs = getAttributes( this.el ),
			parentOriginalAttrs = getAttributes( this.el.parent() ),
			childOriginalAttrs = [],
			endAttrs, parentEndAttrs;

		$.each( this.items, function( i, item ) {
			childOriginalAttrs[ i ] = getAttributes( $( item ) );
		});

		ok( ! this.el.hasClass( "ui-coverflow" ), "Element does not have coverflow class" );
		ok( ! this.el.parent().hasClass( "ui-coverflow-wrapper" ), "Element's parent does not have coverflow wrapper class" );

		this.el.coverflow();

		ok( this.el.hasClass( "ui-coverflow" ), "Element has coverflow class" );
		ok( this.el.parent().hasClass( "ui-coverflow-wrapper" ), "Element's parent has coverflow wrapper class" );

		this.el.coverflow( "destroy" );

		ok( ! this.el.hasClass( "ui-coverflow" ), "Element does not have coverflow class" );
		ok( ! this.el.parent().hasClass( "ui-coverflow-wrapper" ), "Element's parent does not have coverflow wrapper class" );

		this.el.removeData();
		endAttrs = getAttributes( this.el );

		if( $.coverflow.isOldie ) {
			delete endAttrs.onDOMMouseScroll;
			delete endAttrs.onremove;

			endAttrs = $.extend({}, endAttrs );
		}
		deepEqual( endAttrs, originalAttrs, "Element's attributes match original after destroy" );

		parentEndAttrs = getAttributes( this.el.parent() );

		deepEqual( parentOriginalAttrs, parentEndAttrs, "Element's parent attributes match originals after destroy" );

		$.each( this.items, function( i, item ) {
			endAttrs = getAttributes( $( item ).removeData() );

			deepEqual( endAttrs, childOriginalAttrs[ i ], "Element attributes match for child " + i + " after destroy" );
		});
	});

	asyncTest( 'beforeselect event returns correct item', function() {

		var items = this.items;

		this.el
			.coverflow({
				active : 0,
				duration : 1
			})
			.one( 'coverflowselect', function( ev, ui ) {

				equal( 1, ui.index, 'beforeselect event triggers new index' )
				deepEqual( ui.active.get(0), items.eq( 1 ).get(0), 'active element before select matches first image.' );

				start();
			})
			.coverflow( 'select', 1 );

		expect( 2 );
	});
})( jQuery );
