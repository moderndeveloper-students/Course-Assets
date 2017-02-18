module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    uglify: {
      all: {
        files: {
          'dest/app.js': ['js/*.js']
        }
      }
    },
    htmllint: {
      all: ['html/*.html']
    }
  });

  // Default task(s).
  grunt.registerTask('default', function () {
    console.log('Grunt has run')
  });
};