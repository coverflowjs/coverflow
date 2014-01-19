module.exports = function( grunt ) {

"use strict";

// grunt plugins
grunt.loadNpmTasks( "grunt-contrib-less" );
grunt.loadNpmTasks( "grunt-contrib-watch" );
grunt.loadNpmTasks( "grunt-image-resize" );
grunt.loadNpmTasks('grunt-image-resize');

grunt.initConfig({
	pkg: grunt.file.readJSON("package.json"),
	less: {
		dev: {
			options: {
				dumpLineNumbers : true
			},
			files: {
				"assets/css/styles.css": "_less/styles.less"
			}
		},
		prod : {
			options: {
				cleancss : true
			},
			files: {
				"assets/css/styles.css": "_less/styles.less"
			}
		}

	},
	watch: {
		css: {
			files: [
				"_less/**/*.less"
			],
			tasks: [ "less" ]
		}
	},
	imageNormalize: {
		covers: {
			options: {
				height: 400,
				width: 400,
				preserveDirectories: true
			},
			src: [
				"assets/covers/**/*.jpg"
			],
			dest: "assets/img/"
		}
	},
	image_resize: {
		covers : {
			options: {
				width: 400,
				height: 400,
				crop : true,
				quality : 1,
				overwrite: true
			},
			files: {
				"assets/img/acdc.jpg" : "assets/covers/acdc.jpg",
				"assets/img/isayyeah.jpg" : "assets/covers/isayyeah.jpg",
				"assets/img/musicforthejiltedgeneration.jpg" : "assets/covers/musicforthejiltedgeneration.jpg",
				"assets/img/thewall.jpg" : "assets/covers/thewall.jpg",
				"assets/img/billieholiday.jpg" : "assets/covers/billieholiday.jpg",
				"assets/img/iscream.jpg" : "assets/covers/iscream.jpg",
				"assets/img/scenesinthecity.jpg" : "assets/covers/scenesinthecity.jpg",
				"assets/img/bluesalley.jpg" : "assets/covers/bluesalley.jpg",
				"assets/img/jazzgiant.jpg" : "assets/covers/jazzgiant.jpg",
				"assets/img/studyinbrown.jpg" : "assets/covers/studyinbrown.jpg",
				"assets/img/fineandmellow.jpg" : "assets/covers/fineandmellow.jpg",
				"assets/img/milestones.jpg" : "assets/covers/milestones.jpg",
				"assets/img/thesidewinder.jpg" : "assets/covers/thesidewinder.jpg"
			}
		}

	}
});

grunt.registerTask( "default", [ "less:dev" ] );
grunt.registerTask( "build", [ "less:prod" ] );

};
