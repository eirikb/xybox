module.exports = function(grunt) {
  var fs = require('fs');
  var path = require('path');

  var js = {};
  fs.readdirSync('defs').filter(function(file) {
    return file.match(/\.js$/i);
  }).forEach(function(file) {
    var id = path.basename(file, '.js');
    js[id] = fs.readFileSync(path.join('defs', file)).toString();
  });

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
          'index.html': 'jade/index.jade'
        },
        options: {
          data: {
            pkg: '<%= pkg %>',
            js: js
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

  grunt.loadNpmTasks('grunt-contrib');

  grunt.registerTask('default', ['jade', 'cssmin', 'concat', 'uglify']);

  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('dev', ['default', 'connect', 'watch']);
};
