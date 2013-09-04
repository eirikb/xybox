module.exports = function(grunt) {
  var fs = require('fs');

  grunt.initConfig({
    pkg: require('./package.json'),
    concat: {
      dist: {
        src: ['src/main.js'],
        dest: 'dist/app.js'
      },
    },
    uglify: {
      dist: {
        src: 'dist/app.js',
        dest: 'dist/app.min.js'
      },
    },
    watch: {
      scripts: {
        files: ['jade/**', 'src/**', 'defs/**'],
        tasks: ['default']
      },
    },
    jade: {
      compile: {
        files: {
          'index.html': 'jade/index.jade',
          'tutorial.html': 'jade/tutorial.jade'
        },
        options: {
          data: {
            pkg: '<%= pkg %>',
            read: function(name) {
              return fs.readFileSync(name);
            }
          }
        }
      }
    },
    jshint: {
      all: ['src/*.js']
    },
    connect: {
      server: {
        options: {
          port: 8080,
          base: './'
        }
      }
    },
    cssmin: {
      combine: {
        files: {
          'dist/app.min.css': ['src/page.css']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jade');

  grunt.registerTask('default', ['jade', 'cssmin', 'concat', 'uglify']);

  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('dev', ['default', 'connect', 'watch']);
};