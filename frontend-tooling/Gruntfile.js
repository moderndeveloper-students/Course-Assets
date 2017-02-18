module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Project configuration.
  grunt.initConfig({
    uglify: {
      all: {
        files: {
          'dest/app.js': ['js/*.js']
        }
      }
    }
  });

  // Default task(s).
  grunt.registerTask('default', function () {
    console.log('Grunt has run')
  });
};