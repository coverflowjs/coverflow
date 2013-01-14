/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

	module( 'ui-coverflow: transitions', {
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
			if( ! $.isFunction( $.fn.transit ) ) {
				throw '$.fn.transit is not defined';
			}
			this._super();
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
