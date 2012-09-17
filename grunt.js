module.exports = function(grunt) {

    grunt.initConfig({
        concat: {
            dist: {
                src: ['src/helpers.js', 'src/events.js', 'src/preload.js', 'src/physics.js', 'src/graphics.js', 'src/game.js'],
                dest: 'xybox.js',
                separator: ';'
            },
            all: {
                src: ['components/box2d.min.js', 'components/easeljs-0.4.1.min.js', 'components/kibo.js', 'components/preloadjs-0.1.0.min.js', 'components/trolley.js', 'components/underscore.js', 'src/helpers.js', 'src/events.js', 'src/preload.js', 'src/physics.js', 'src/graphics.js', 'src/game.js'],
                dest: 'xybox-all.js',
                separator: ';'
            }
        },
        min: {
            dist: {
                src: ['xybox.js'],
                dest: 'xybox.min.js'
            },
            all: {
                src: ['xybox-all.js'],
                dest: 'xybox-all.min.js'
            }
        }
    });

    grunt.registerTask('default', 'concat min');
};
