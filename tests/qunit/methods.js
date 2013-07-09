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
	
	test( 'destroy', 9, function () {
		var originalAttrs = getAttributes( this.el ),
			parentOriginalAttrs = getAttributes( this.el.parent() ),
			endAttrs, parentEndAttrs;
			
		ok( ! this.el.hasClass( "ui-coverflow" ), "Element does not have coverflow class" );
		ok( ! this.el.parent().hasClass( "ui-coverflow-wrapper" ), "Element's parent does not have coverflow wrapper class" );
		
		this.el.coverflow();
			
		ok( this.el.hasClass( "ui-coverflow" ), "Element has coverflow class" );
		ok( this.el.parent().hasClass( "ui-coverflow-wrapper" ), "Element's parent has coverflow wrapper class" );
		
		this.el.coverflow( "destroy" );
			
		ok( ! this.el.hasClass( "ui-coverflow" ), "Element does not have coverflow class" );
		ok( ! this.el.parent().hasClass( "ui-coverflow-wrapper" ), "Element's parent does not have coverflow wrapper class" );
		
		endAttrs = getAttributes( this.el );
		
		// Have to compare each attribute since the original element may not have had any styling, leading to a comparison of "" to undefined
		$.each( endAttrs, function ( n, v ) {
			strictEqual	( v, ( originalAttrs[ n ] || ""), "Element attribute " + n + " matches original after destroy" );
		});
		
		parentEndAttrs = getAttributes( this.el.parent() );
		
		deepEqual( parentOriginalAttrs, parentEndAttrs, "Element's parent attributes match originals after destroy" );
		
	});

})( jQuery );
