require.config({

    baseUrl: 'coverflow/assets/',
    paths: {
		jquery: [
            '//code.jquery.com/jquery-1.10.1.min',
			'js/jquery-1.10.1.min'
		],
		// custom minimal jQueryUI
		jqueryui : 'js/jquery-ui/jquery.ui.min',
		smartresize : 'js/jquery.smartresize',
		bootstrap : 'bootstrap/js/bootstrap-collapse',
		transitionPackage : 'js/coverflowjs/libs/jquery.transit.package.min',
		jqm : 'js/coverflowjs/libs/jquery.mobile.custom.min',
		coverflowjs : 'js/coverflowjs/coverflow'
    },
    shim: {
        jqueryui : {
			deps: [ 'jquery' ] ,
			exports: '$'
		},
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
			deps: [ 'jquery', 'jqueryui' ] ,
			exports: '$'
		},
		transitionPackage : {
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
	'jqueryui',
	'transitionPackage',
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
