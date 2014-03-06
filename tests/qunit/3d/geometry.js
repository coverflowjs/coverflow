/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

	var three_d_transformations = {
		left : 'matrix3d(0.494981, 0, -0.707097, 0, 0, 0.7, 0, 0, 0.707097, 0, 0.494981, 0, 0, 0, 0, 1)',
		active : 'matrix(1, 0, 0, 1, 0, 0)',
		right : 'matrix3d(0.494981, 0, 0.707097, 0, 0, 0.7, 0, 0, -0.707097, 0, 0.494981, 0, 0, 0, 0, 1)'
	},
	testItemProperties = function( item, state ) {

		item = item.jquery ? item.get( 0 ) : item;

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
						three_d_transformations.left,
						'Item aligned left, scaled.'
					);
				equal( $item.hasClass( 'ui-state-active' ), false, 'item without ui-state-active css class' );
				break;
			case 'right':
				strictEqual(
						cssTransformation,
						three_d_transformations.right,
						'Item aligned right, scaled.'
					);
				equal( $item.hasClass( 'ui-state-active' ), false, 'item without ui-state-active css class' );
				break;
			default:
				strictEqual(
						cssTransformation,
						three_d_transformations.active,
						'Item at center position, active.'
					);
				equal( $item.hasClass( 'ui-state-active' ), true, 'item has ui-state-active css class' );
		}

	};

	module( 'CoverflowJS: geometry', {
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

		$.each( this.items, function ( k, item ) {

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
