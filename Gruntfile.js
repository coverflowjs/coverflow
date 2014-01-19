module.exports = function( grunt ) {

"use strict";

var uiFiles = [
		"libs/jquery-ui/ui/jquery.ui.core.js",
		"libs/jquery-ui/ui/jquery.ui.widget.js",
		"libs/jquery-ui/ui/jquery.ui.effect.js"
	],
	pluginFiles = [
		"src/js/support.core.js",
		"src/js/support.transform3d.js",
		"src/js/renderer.classic.js",
		"src/js/renderer.3d.js",
		"src/js/coverflow.js"
	],
	jsFiles = uiFiles.concat( pluginFiles ),
	cssFiles = [
		"src/css/coverflow.css"
	],
	banner = "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - " +
		"<%= grunt.template.today('isoDate') %>\n" +
		"<%= pkg.homepage ? '* ' + pkg.homepage + '\\n' : '' %>" +
		"* Copyright (c) 2008-<%= grunt.template.today('yyyy') %> <%= pkg.author.name %>;" +
		" Licensed <%= _.pluck(pkg.licenses, 'type').join(', ') %> */\n",

	// minified files
	minify = {
		options: {
			preserveComments: false
		},
		main: {
			options: {
				banner: banner
			},
			files: {
				"dist/coverflow.min.js": "dist/coverflow.js",
				"dist/coverflow.standalone.min.js": "dist/coverflow.standalone.js"
			}
		}
	},
	minifyCSS = {
		options: {
			keepSpecialComments: 0
		},
		main: {
			options: {
				keepSpecialComments: "*"
			},
			src: "dist/coverflow.css",
			dest: "dist/coverflow.min.css"
		}
	};


// grunt plugins
grunt.loadNpmTasks( "grunt-git-authors" );
grunt.loadNpmTasks( "grunt-autoprefixer" );
grunt.loadNpmTasks( "grunt-contrib-jshint" );
grunt.loadNpmTasks( "grunt-contrib-uglify" );
grunt.loadNpmTasks( "grunt-contrib-concat" );
grunt.loadNpmTasks( "grunt-contrib-qunit" );
grunt.loadNpmTasks( "grunt-contrib-copy");
grunt.loadNpmTasks( "grunt-compare-size" );
grunt.loadNpmTasks( "grunt-contrib-less" );
grunt.loadNpmTasks( "grunt-contrib-watch" );

grunt.initConfig({
	pkg: grunt.file.readJSON("package.json"),
	files: {
		dist: "<%= pkg.name %>-<%= pkg.version %>",
	},
	compare_size: {
		all: [
			"dist/coverflow.min.js",
			"dist/coverflow.js"
		]
	},
	concat: {
		js: {
			options: {
				banner: banner,
				stripBanners: {
					block: true
				}
			},
			src: jsFiles,
			dest: "dist/coverflow.js"
		},
		standalone : {
			options: {
				banner: banner,
				stripBanners: {
					block: true
				}
			},
			src: pluginFiles,
			dest: "dist/coverflow.standalone.js"
		},
		css: {
			options: {
				banner: banner,
				stripBanners: {
					block: true
				}
			},
			src: cssFiles,
			dest: "dist/coverflow.css"
		}
	},
	uglify: minify,
	copy: {
		main : {
			files: [{
				src: [
					"AUTHORS.txt",
					"MIT-LICENSE.txt",
					"README.md",
					"package.json"
				],
				dest: "dist/",
				filter: "isFile"
			}]
		}
	},
	qunit: {
		all: [ "tests/qunit/*.html" ]
	},
	jshint: {
		all: {
			options: {
				jshintrc: "src/.jshintrc"
			},
			files: {
				src: "src/js/*.js"
			}
		}
	},
	autoprefixer: {
		all: {
			files: {
				"src/css/coverflow.css" : "src/css/coverflow.unprefixed.css"
			}
		}
	},
	less: {
		dev: {
			options: {
				dumpLineNumbers : true
			},
			files: {
				"src/css/coverflow.unprefixed.css": "src/css/coverflow.less"
			}
		},
		dist : {
			options: {
				cleancss : true
			},
			files: {
				"src/css/coverflow.unprefixed.css": "src/css/coverflow.less"
			}
		}

	},
	watch: {
		css: {
			options : {
				livereload : true
			},
			files: [
				"src/css/**/*.less",
				"src/js/**/*.js",
				"tests/qunit/visual*.html"
			],
			tasks: [ "css" ]
		}
	},
});

grunt.registerTask( "default", [ "lint", "test" ] );
grunt.registerTask( "lint", [ "jshint" ] );
grunt.registerTask( "test", [ "qunit" ] );
grunt.registerTask( "css", [ "less:dev", "autoprefixer" ] );
grunt.registerTask( "css:release", [ "less:dist", "autoprefixer", "concat:css" ] );
grunt.registerTask( "build", [ "css", "concat:js", "concat:standalone", "copy", "uglify" ] );

};
