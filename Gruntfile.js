module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
      dist: {
        src: ['src/main.js'],
        dest: 'js/app.js'
      },
    },
    uglify: {
      dist: {
        src: 'js/app.js',
        dest: 'js/app.min.js'
      },
    },
    watch: {
      scripts: {
        files: ['jade/**', 'src/**'],
        tasks: ['default']
      },
    },
    jade: {
      compile: {
        files: {
          'index.html': 'jade/index.jade'
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
          'css/app.min.css': ['src/page.css']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib');

  grunt.registerTask('default', ['jade', 'cssmin', 'concat', 'uglify']);

  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('dev', ['default', 'connect', 'watch']);
};
