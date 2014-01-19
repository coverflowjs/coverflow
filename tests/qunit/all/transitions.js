(function($) {

	module( 'CoverflowJS: transitions', {
		setup: function() {
			this.el = $( '#qunit-fixture' ).find( '.coverflow' );
			this.items = this.el.children();
		}
	});


	$.widget( 'ui.testCoverflow', $.ui.coverflow, {
		_create : function() {
			if( ! $.isFunction( requestAnimationFrame ) ) {
				throw 'requestAnimationFrame is not defined';
			}

			this._super();

			if( this.useJqueryAnimate ) {
				throw 'no transitions support, using jQuery animate instead.';
			}
		},
		_transition : function( o ) {

			ok( true, 'transition handler called' );
			return this._super( o );
		}
	});

	asyncTest( 'internal calls', 2, function() {
		this.el
			.testCoverflow()
			.one( 'testcoverflowselect', function( ev, ui ) {
				ok( true, 'select event fired.' );
				start();
			})
			.testCoverflow( 'select', 2 );
	});

})( jQuery );
