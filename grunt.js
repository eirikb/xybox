module.exports = function(grunt) {

    grunt.initConfig({
        concat: {
            dist: {
                src: ['src/game.js', 'src/graphics.js', 'src/events.js'],
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
