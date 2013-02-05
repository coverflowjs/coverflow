/*global module:false*/
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: '<json:package.json>',
        meta: {
            banner: '/**\n' +
				' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
				' * Copyright (c) 2008-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
				' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */'
        },
        concat: {
            dist: {
                src: [ '<banner:meta.banner>', '<file_strip_banner:src/<%= pkg.name %>.js>' ],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        min: {
            dist: {
                src: [ '<banner:meta.banner>', 'src/js/coverflow.js' ],
                dest: 'dist/coverflow.min.js'
            }
        },
		copy: {
			dist : {
				options : {
					flatten : true
				},
				files : {
					'dist/': [
						'AUTHORS.txt',
						'MIT-LICENSE.txt',
						'README.md',
						'src/css/coverflow.css'
					]
				}
			}
		},
		qunit: {
			all: ['tests/qunit/**/*.html']
		},
        lint: {
			src : 'src/js/coverflow.js'
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true,
				laxbreak: true
            },
            globals: {
                jQuery: true,
				Modernizr: true,
				requestAnimationFrame: true
            }
        }
    });

	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.registerTask( 'default', 'lint qunit min copy' );

};
