var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
 
gulp.task('minify-css', function() {
  return gulp.src('styles/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', function () {
  console.log('Gulp has run!');
});