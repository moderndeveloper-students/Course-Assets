module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    cssmin: {
      all: {
        files: {
          'dest/app.min.css': ['styles/*.css']
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
      },
      dev: {
        force: true
      }
    },
    sass: {
      all: {
        files: {
          'styles/style.css': 'sass/style.scss'
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
    },
    jasmine: {
      all: {
        src: ['js/*.js'],
        options: {
          specs: ['spec/**/*Spec.js']
        }
      }
    },
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          src: ['img/*.{png,jpg,gif}'],
          dest: 'dest/'
        }]
      }
    },
    version: {
      src: ['package.json', 'index.html'],
      options: {
        prefix: '[\\?]?version[\\\'"]?[=:]\\s*[\\\'"]?'
      }
    },
    exec: {
      add: 'git add .', // Add all changed files to the commit
      commit: {
          cmd: function () {
            var oldPkg = this.config('pkg') // Get the pkg property from our config
              , pkg = grunt.file.readJSON('package.json')
              , cmd = 'git commit -am "Updating from ' + oldPkg.version + ' to ' + pkg.version + '"';
            return cmd;
        }
      },
      push: 'git push' // Send our changes to the repository
    }
  });

  grunt.registerTask('minify', function (full) {
    if (full) {
      grunt.task.run(['cssmin', 'uglify', 'imagemin']);
    } else {
      grunt.task.run(['cssmin', 'uglify']);
    }
  });

  grunt.registerTask('deploy', function (releaseType) {
    if (!releaseType) {
      releaseType = 'patch';
    }
    grunt.task.run(['version::' + releaseType, 'exec:add', 'exec:commit', 'exec:push']);
  });

  // Default task(s).
  grunt.registerTask('default', function () {
    console.log('Grunt has run');
  });
};