module.exports = function (grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

		bower: {
			install: {
				options: {
					targetDir: 'libraries',
					layout: 'byComponent'
				}
			}
		},
		
        qunit: {
            all: {
                options: {
                    urls: [
                        'http://localhost:8000/test/index.html'
                    ]
                }
            }
        },

        // for changes to the front-end code
        watch: {
            scripts: {
                files: ['simmer.js', 'test/*.js'],
                tasks: ['test']
            }
        },

        jshint: {
            files: ['simmer.js'],
            options: {
                globals: {
                    jQuery: true,
                    console: false,
                    module: true,
                    document: true
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 8000,
                    base: '.'
                }
            }
        }
    });

    grunt.registerTask('test', ['bower:install','jshint', 'connect', 'qunit']);
    grunt.registerTask('tdd', ['watch']);
};
