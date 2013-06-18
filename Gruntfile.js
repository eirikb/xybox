module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
      dist: {
        src: ['src/intro.js', 'package.json', 'src/helpers.js', 'src/events.js', 'src/preload.js', 'src/physics.js', 'src/graphics.js', 'src/game.js', 'src/outro.js'],
        dest: 'xybox.js',
        separator: ';'
      },
      all: {
        src: ['components/box2d/index.js', 'components/easel/index.js', 'components/kibo/index.js', 'components/preload/index.js', 'components/trolley/index.js', 'components/underscore/underscore.js', 'xybox.js'],
        dest: 'xybox-all.js',
        separator: ';'
      }
    },
    uglify: {
      dist: {
        src: ['xybox.js'],
        dest: 'xybox.min.js'
      },
      all: {
        src: ['xybox-all.js'],
        dest: 'xybox-all.min.js'
      }
    },
    watch: {
      scripts: {
        files: ['src/**'],
        tasks: ['default']
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'src/*.js'],
      options: {
        ignores: ['src/intro.js', 'src/outro.js']
      }
    },
    copy: {
      main: {
        files: [{
          src: 'xybox*',
          dest: '../xybox-pages/lib/'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib');

  grunt.registerTask('default', ['concat', 'jshint', 'uglify', 'copy']);
};
