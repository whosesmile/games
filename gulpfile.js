var gulp = require('gulp');

var jshint = require('gulp-jshint');

gulp.task('default', function () {
  return gulp.src(['./server.js', './app/**/*.js', '!app/connect/thrift/**/*.js', '!**/laundry/**/*', '!**/cleaning/**/*', '!**/shopping/**/*', '!**/yangche/**/*'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});