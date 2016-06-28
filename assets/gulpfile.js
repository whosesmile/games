var path = require('path');
var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var sequence = require('run-sequence');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var insert = require('gulp-insert');
var minify = require('gulp-minify-css');
var px2rem = require('gulp-smile-px2rem');
var nunjucks = require('gulp-nunjucks');

// for dist should be dist
var target = '.tmp/';

/**
 * clean .tmp and dist
 */
gulp.task('clean', function () {
  return gulp.src(['.tmp', 'dist'], {
    read: false
  }).pipe(clean());
});

gulp.task('sync:source', function () {
  return gulp.src(['src/**/*', '!src/js/base.js', '!src/css/**/*', '!src/templates/**/*'], {
    base: 'src'
  }).pipe(gulp.dest(target)).pipe(connect.reload());
});

// px2rem css files
gulp.task('px2rem', function () {
  return gulp.src(['src/css/**/*'], {
    base: 'src'
  }).pipe(px2rem()).pipe(gulp.dest(target)).pipe(connect.reload());
});

// insert debug css
gulp.task('concat:debug', function () {
  return gulp.src('src/vendor/ui.css')
    .pipe(insert.prepend('/*! 警告：调试使用 线上需删除 */\n@media only screen and (min-device-width:1366px) {body { max-width: 750px; margin-left: auto !important; margin-right: auto !important; }}\n\n'))
    .pipe(gulp.dest(target + '/vendor'))
    .pipe(connect.reload());
});

// minify css
gulp.task('minify:css', function () {
  return gulp.src(target + '/css/**/*')
    .pipe(minify({
      advanced: false
    }))
    .pipe(gulp.dest(target + '/css'))
    .pipe(connect.reload());
});

// uglify js
gulp.task('uglify:js', function () {
  return gulp.src([target + '/js/**/*'], {
    base: 'src'
  }).pipe(uglify()).pipe(gulp.dest(target)).pipe(connect.reload());
});

// nunjucks
gulp.task('nunjucks', function () {
  return gulp.src('src/templates/**/*')
    .pipe(nunjucks.precompile())
    .pipe(gulp.dest(target + '/templates'))
    .pipe(connect.reload());
});

// insert debug css
gulp.task('concat:tmpl', ['nunjucks'], function () {
  return gulp.src([target + '/templates/**/*.js', 'src/js/base.js'])
    .pipe(concat('base.js'))
    .pipe(gulp.dest(target + '/js/'))
    .pipe(connect.reload());
});

// watch file change
gulp.task('watch', function () {
  gulp.watch(['src/**/*', '!src/js/base.js', '!src/css/**/*', '!src/templates/**/*', '!src/vendor/ui.css'], ['sync:source']);
  gulp.watch(['src/css/**/*'], ['px2rem']);
  gulp.watch(['src/templates/**/*.html', 'src/js/base.js'], ['concat:tmpl']);
  gulp.watch(['src/vendor/ui.css'], ['concat:debug']);
});

// connect server
gulp.task('connect', function () {
  connect.server({
    root: [target, '.'],
    port: 7070,
    livereload: true
  });
});

// Default task clean temporaries directories and launch the main optimization build task
gulp.task('default', function () {
  sequence('clean', ['sync:source', 'px2rem'], ['concat:debug', 'concat:tmpl'], ['connect', 'watch']);
});

// build project
gulp.task('dist', function () {
  target = 'dist/';
  sequence('clean', ['sync:source', 'px2rem'], ['minify:css', 'concat:tmpl'], ['uglify:js']);
});
