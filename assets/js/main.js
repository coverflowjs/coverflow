require.config({

    baseUrl: baseUrl + '/assets/',
    paths: {
		jquery: [
            '//code.jquery.com/jquery-1.10.2.min',
			'js/jquery-1.10.1.min'
		],
		// custom minimal jQueryUI
		smartresize : 'js/jquery.smartresize',
		bootstrap : 'bootstrap/dist/js/bootstrap.min',
		jqm : 'js/jquery.mobile.custom.min',
		coverflowjs : 'js/coverflowjs/coverflow.min'
    },
    shim: {
		jqm : {
			deps: [ 'jquery' ] ,
			exports: '$'
		},
		bootstrap : {
			deps: [ 'jquery' ] ,
			exports: '$'
		},
		smartresize : {
			deps: [ 'jquery' ] ,
			exports: '$'
		},
		coverflowjs : {
			deps: [ 'jquery' ] ,
			exports: '$'
		}
	}
});

require.onError =  function( error ) {
	if( ! 'console' in window ) {
		return;
	}
	console.log( error.requireType, error.requireModules );

	if( error.stack ) {
		console.log( error.stack );
	}
};

require([
	// coverflow - required js files (full featureset)
	'jquery',
	'jqm',
	'coverflowjs',
	// api page dependencies
	'bootstrap',
	'smartresize'
],
function( $ ) {

	$(function(){

		var $license = $( '#license' ),
			$coverflow = $( '#coverflow' ).coverflow({
				active : 2,
				select : function( ev, ui ) {
					var el = ui.active;

					$license.html([
						'<p>',
							'<a href="' + el.data( 'license' ) + '">Some rights reserved</a> by ',
							'<a href="' + el.data( 'contact' ) + '"><em>' + el.data( 'author' ) + '</em></a>',
						'</p>'
					].join('') );
				}
			});

		$(window).smartresize(function() {
			$coverflow.coverflow();
		});
	});

});
