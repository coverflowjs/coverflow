require.config({

    baseUrl: "src/js",

	paths : {
		jquery : "./../../libs/jquery-ui/jquery-1.10.2",
		uiCore: "./../../libs/jquery-ui/ui/jquery.ui.core",
		uiWidget: "./../../libs/jquery-ui/ui/jquery.ui.widget",
		uiEffects: "./../../libs/jquery-ui/ui/jquery.ui.effect",
		coverflowjs : "./coverflow",
		renderer3d : "./renderer.3d",
		rendererClassic : "./renderer.classic",
		supportCore : "./support.core",
		supportTransform : "./support.transform3d"
	},
	shim : {
		jquery : {
			exports : "$"
		},
		uiCore : [ "jquery" ],
		uiWidget : [ "jquery" ],
		uiEffects : [ "jquery" ],
		renderer3d : [ "jquery", "rendererClassic" ],
		rendererClassic : [ "jquery" ],
		supportCore : [ "jquery" ],
		supportTransform : [ "jquery" ],
		coverflowjs : {
			deps : [
				"jquery",
				"uiCore",
				"uiWidget",
				"uiEffects",
				"renderer3d",
				"rendererClassic",
				"supportCore",
				"supportTransform"
			]
		}
	}

});
