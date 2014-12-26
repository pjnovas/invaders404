
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      game: {
        src: [
            "scripts/rAFPolyfill.js"
          , "scripts/gameTime.js"

          , "scripts/camera.js"
          , "scripts/particles.js"

          , "scripts/classes/class.js"
          , "scripts/classes/static.js"
          , "scripts/classes/imageMapper.js"
          , "scripts/classes/imageCreator.js"
          , "scripts/classes/drawableElement.js"
          , "scripts/classes/shoot.js"
          , "scripts/classes/ship.js"
          , "scripts/classes/invasion.js"
          , "scripts/classes/alien.js"
          , "scripts/classes/brick.js"
          , "scripts/classes/shieldBrick.js"
          , "scripts/classes/shield.js"
          , "scripts/classes/invaders.js"

          , "scripts/classes/input.js"
         ],
        dest: 'game.js'
      }
    },

    uglify: {
      game: {
        options: {
          stripBanners: {
            line: true
          },
        },
        files: {
          'game.min.js': [ 'game.js' ]
        }
      }
    },

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask("default", [ "concat", "uglify" ]);

};
