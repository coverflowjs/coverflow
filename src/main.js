require.config({

    baseUrl: '../src/',

	paths : {
		ui: '//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min',
		mobile : './../libs/jquery.mobile.custom.min',
		coverflowjs : './js/coverflow',
		renderer3d : './js/renderer.3d',
		rendererClassic : './js/renderer.classic',
		supportCore : './js/support.core',
		supportTransform : './js/support.transform3d'
	},
	shim : {

		ui : {
			deps: [
				'jquery'
			],
			exports : '$'
		},
		mobile : {
			deps: [
				'jquery'
			],
			exports : '$'
		},
		renderer3d : {
			deps: [
				'jquery'
			],
			exports : '$'
		},
		rendererClassic : {
			deps: [
				'jquery'
			],
			exports : '$'
		},
		supportCore : {
			deps: [
				'jquery'
			],
			exports : '$'
		},
		supportTransform : {
			deps: [
				'jquery'
			],
			exports : '$'
		},
		coverflowjs : {
			deps : [
				'ui',
				'renderer3d',
				'rendererClassic',
				'supportCore',
				'supportTransform'
			],
			exports : '$'
		}
	}

});
