module.exports = function( grunt ) {

"use strict";

var jsFiles = [
		'src/js/coverflow.js'
	],
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
				"dist/coverflow.min.js": "dist/coverflow.js"
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
grunt.loadNpmTasks( "grunt-contrib-jshint" );
grunt.loadNpmTasks( "grunt-contrib-uglify" );
grunt.loadNpmTasks( "grunt-contrib-concat" );
grunt.loadNpmTasks( "grunt-contrib-qunit" );
grunt.loadNpmTasks( "grunt-contrib-copy");
grunt.loadNpmTasks( "grunt-compare-size" );
grunt.loadNpmTasks( "grunt-git-authors" );

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
					"package.json",
					"libs/jquery.mobile.custom.js",
					"libs/jquery.mobile.custom.min.js",
				],
				dest: 'dist/',
				filter: 'isFile'
			}]
		}
	},
	qunit: {
		files: "tests/qunit/**/*.html"
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
	}
});

grunt.registerTask( "default", [ "lint", "test" ] );
grunt.registerTask( "lint", [ "jshint" ] );
grunt.registerTask( "test", [ "qunit" ] );
grunt.registerTask( "build", [ "concat", "copy", "uglify" ] );

};
