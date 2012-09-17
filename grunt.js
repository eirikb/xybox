module.exports = function(grunt) {

    grunt.initConfig({
        concat: {
            dist: {
                src: ['components/box2d.min.js', 'components/easeljs-0.4.1.min.js', 'components/kibo.js', 'components/preloadjs-0.1.0.min.js', 'components/trolley.js', 'components/underscore.js', 'src/game.js', 'src/graphics.js', 'src/events.js'],
                dest: 'xybox.js',
                separator: ';'
            }
        },
        min: {
            dist: {
                src: ['xybox.js'],
                dest: 'xybox.min.js'
            }
        }
    });

    grunt.registerTask('default', 'concat', 'min');
};
