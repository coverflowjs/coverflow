/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

	/*
	======== A Handy Little QUnit Reference ========
	http://docs.jquery.com/QUnit

	Test methods:
		expect(numAssertions)
		stop(increment)
		start(decrement)
	Test assertions:
		ok(value, [message])
		equal(actual, expected, [message])
		notEqual(actual, expected, [message])
		deepEqual(actual, expected, [message])
		notDeepEqual(actual, expected, [message])
		strictEqual(actual, expected, [message])
		notStrictEqual(actual, expected, [message])
		raises(block, [expected], [message])
	*/

	var transformations = {
		left : 'matrix(1, -0.2, 0, 1, 0, 0)',
		active : 'matrix(1.3, 0, 0, 1.3, 0, 0)',
		right : 'matrix(1, 0.2, 0, 1, 0, 0)'
	},
	testItemProperties = function( item, state ) {

		var $item = $( item ),
			cssTransformation = $.trim( $item.css( 'transform' ) );

		if( typeof state === 'undefined' ) {
			state = 'active';
		}
		ok( $item.hasClass( 'ui-coverflow-item' ), 'item has widget items class.' );

		switch( state ) {
			case 'left':
				strictEqual(
						cssTransformation,
						transformations.left,
						'Item aligned left.'
					);
				equal( $item.hasClass( 'ui-state-active' ), false, 'item without ui-state-active css class' );
				break;
			case 'right':
				strictEqual(
						cssTransformation,
						transformations.right,
						'Item aligned right.'
					);
				equal( $item.hasClass( 'ui-state-active' ), false, 'item without ui-state-active css class' );
				break;
			default:
				strictEqual(
						cssTransformation,
						transformations.active,
						'Item at center position, scaled, active.'
					);
				equal( $item.hasClass( 'ui-state-active' ), true, 'item has ui-state-active css class' );
		}

	};

	module( 'ui-coverflow: geometry', {
		setup: function() {
			this.el = $( '#qunit-fixture' ).find( '.coverflow' );
			this.items = this.el.children();
		}
	});

	test( 'initial transformations', 36, function() {

		var items = this.items;

		this.el.coverflow({
			active : 2
		});

		$.each( this.items, function (k, item ) {

			var state = k < 2 ? 'left' : ( k == 2 ) ? 'active' : 'right' ;

			testItemProperties( item, state );
		});
	});

	test( 'initial select event', 5, function() {
		var items = this.items,
			itemIndex = 4;

		this.el.coverflow({
			active : itemIndex,
			select : function( ev, ui ) {
				strictEqual( ui.index, itemIndex, 'item index is correct' );
				strictEqual( ui.active.get( 0 ), items.eq( itemIndex ).get( 0 ), 'active item is preselected item.' );
				testItemProperties( ui.active );
			}
		});

	});

	asyncTest( 'geometry after selection', 37, function() {
		var itemIndex = 3,
			el = this.el,
			items = this.items,
			activePosition;

		el
			.one( 'coverflowselect', function( ev, ui ) {
				activePosition = ui.active.offset();
			})
			.coverflow({
				active : 1,
				duration: 1
			});

		el
			.one( 'coverflowselect', function( ev, ui ) {
				strictEqual( ui.index, itemIndex, 'item index is correct' );
				$.each( items, function (k, item ) {

					var state = k < itemIndex ? 'left' : ( k == itemIndex ) ? 'active' : 'right' ;

					testItemProperties( item, state );
				});
				start();
			})
			.coverflow( 'select', itemIndex );

	});

})( jQuery );
