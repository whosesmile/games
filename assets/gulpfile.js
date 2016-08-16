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
var annotate = require('gulp-ng-annotate');
var html2js = require("gulp-ng-html2js")
var minifyHtml = require("gulp-minify-html");

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
  return gulp.src(['src/**/*', '!src/js/base.js', '!src/css/**/*', '!src/templates/**/*', '!src/js/admin/', '!src/js/admin/**/*'], {
    base: 'src'
  }).pipe(gulp.dest(target)).pipe(connect.reload());
});

// px2rem css files
gulp.task('px2rem', function () {
  gulp.src(['src/css/admin.css'], {
    base: 'src'
  }).pipe(gulp.dest(target)).pipe(connect.reload());
  return gulp.src(['src/css/**/*', '!src/css/admin.css'], {
    base: 'src'
  }).pipe(px2rem()).pipe(gulp.dest(target)).pipe(connect.reload());
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

// html2js for angular
gulp.task('html2js', function () {
  return gulp.src(['src/js/admin/templates/**/*.html'])
    .pipe(minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(html2js({
      moduleName: 'app',
      declareModule: false,
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('src/js/admin/'));
});

// concat admin
gulp.task('concat:admin', ['html2js'], function () {
  var stream = gulp.src(['src/js/admin/index.js', 'src/js/admin/**/*.js'])
    .pipe(concat('admin.js'));

  // 开发期间不需要
  if (target === 'dist/') {
    stream = stream.pipe(annotate());
  }
  return stream
    .pipe(gulp.dest(target + '/js/'))
    .pipe(connect.reload());
});

// watch file change
gulp.task('watch', function () {
  gulp.watch(['src/**/*', '!src/js/base.js', '!src/css/**/*', '!src/templates/**/*'], ['sync:source']);
  gulp.watch(['src/css/**/*'], ['px2rem']);
  gulp.watch(['src/templates/**/*.html', 'src/js/base.js'], ['concat:tmpl']);
  gulp.watch(['src/js/admin/**/*'], ['concat:admin']);
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
  sequence('clean', ['sync:source', 'px2rem'], ['concat:tmpl', 'concat:admin'], ['connect', 'watch']);
});

// build project
gulp.task('dist', function () {
  target = 'dist/';
  sequence('clean', ['sync:source', 'px2rem'], ['minify:css', 'concat:tmpl', 'concat:admin'], ['uglify:js']);
});
