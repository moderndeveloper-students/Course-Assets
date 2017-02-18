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
    },
    csslint: {
      all: {
        src: ['styles/*.css']
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'js/*.js'],
      options: {
          asi: true, // Don't worry about missing semicolons
          undef: true, // Warn about undeclared globals
          globals: { // Pass in a list of globals we don't want warnings about
            module: true,
            require: true,
            console: true
          }
      }
    },
    sass: {
      all: {
        files: {
          'styles/style.css': 'sass/style.scss'
        }
      }
    }
  });

  // Default task(s).
  grunt.registerTask('default', function () {
    console.log('Grunt has run');
  });
};