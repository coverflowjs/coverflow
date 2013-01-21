(function($) {

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

})( jQuery );
