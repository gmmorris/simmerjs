/*globals require, module*/
module.exports = function (grunt) {

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    bower: {
      install: {
        options: {
          targetDir: 'bower_components',
          layout: 'byComponent'
        }
      }
    },

    qunit: {
      all: {
        options: {
          urls: [
            'http://localhost:8010/test/compiled/qsa.test.html',
            'http://localhost:8010/test/compiled/jquery-legacy.test.html',
            'http://localhost:8010/test/compiled/jquery.test.html',
            'http://localhost:8010/test/compiled/sizzle.test.html'
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
          port: 8010,
          base: '.'
        }
      }
    },
    includes: {
      tests: {
        options: {
          duplicates: false,
          debug: true,
          banner: ''
        },
        files: [
          // querySelectorAll
          {
            cwd: 'test/',
            src: 'qsa.test.html',
            dest: 'test/compiled/qsa.test.html'
          },
          // jquery legacy
          {
            cwd: 'test/',
            src: 'jquery-legacy.test.html',
            dest: 'test/compiled/jquery-legacy.test.html'
          },
          // jquery
          {
            cwd: 'test/',
            src: 'jquery.test.html',
            dest: 'test/compiled/jquery.test.html'
          },
          // sizzle
          {
            cwd: 'test/',
            src: 'sizzle.test.html',
            dest: 'test/compiled/sizzle.test.html'
          }
        ],
      },
    },
    plato: {
      report : {
        files: {
          'report' : ['simmer.js']
        }
      }
    }
  });

  grunt.registerTask('test', ['bower:install', 'jshint', 'includes:tests', 'connect', 'qunit']);
  grunt.registerTask('tdd', ['watch']);
};
