module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    htmllint: {
      all: ['html/*.html']
    },
    csslint: {
      all: {
        src: ['css/*.css']
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'js/*.js'],
      options: {
        asi: true, // Don't worry about missing semicolons
        undef: true, // Warn about undeclared globals
        globals: { // Pass in a list of globals we don't want warnings about
          module: true,
          require: true
        }
      },
      dev: {
        force: true
      }
    },
    sass: {
      all: {
        files: {
          'css/style.css': 'sass/style.scss'
        }
      }
    },
    cssmin: {
      all: {
        files: {
          'dest/app.css': ['css/*.css']
        }
      }
    },
    uglify: {
      all: {
        files: {
          'dest/app.js': ['js/*.js']
        }
      }
    },
    watch: {
      scripts: {
        files: ['js/*.js'],
        tasks: ['jshint:dev'],
        options: {
          livereload: true
        }
      },
      sass: {
        files: ['sass/*.scss'],
        tasks: ['sass'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.registerTask('validate', ['htmllint', 'csslint', 'jshint']);

  grunt.registerTask('minify', ['cssmin', 'uglify']);

  grunt.registerTask('build', ['sass', 'minify']);

  grunt.registerTask('default', ['build']);
};