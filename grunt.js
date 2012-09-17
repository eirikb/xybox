module.exports = function(grunt) {

    grunt.initConfig({
        concat: {
            dist: {
                src: ['src/game.js', 'src/graphics.js', 'src/events.js'],
                dest: 'xybox.js',
                separator: ';'
            }
        }
    });

    grunt.registerTask('default', 'concat');
};
