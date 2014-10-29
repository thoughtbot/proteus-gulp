var gulp = require('gulp'),
  include = require('gulp-include'),
  concat = require('gulp-concat'),
  haml = require('gulp-ruby-haml'),
  sass = require('gulp-ruby-sass'),
  neat = require('node-neat').includePaths,
  sourcemaps = require('gulp-sourcemaps'),
  coffee = require('gulp-coffee'),
  deploy = require('gulp-gh-pages');

var paths = {
  haml: './source/views/*.haml',
  coffee: './source/assets/javascripts/**/*.coffee',
  scss: './source/assets/stylesheets/**/*.scss',
  images: './source/assets/images/*',
  fonts: './source/assets/fonts/*'
};

// Server
gulp.task('express', function() {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')({port: 4002}));
  app.use(express.static('./build'));
  app.listen(4000);
});

// Haml templates
gulp.task('views', function () {
  gulp.src(paths.haml)
    .pipe(haml())
    .pipe(gulp.dest('./build'));
});

// Scss stylesheets
gulp.task('stylesheets', function() {
  return gulp.src(paths.scss)
    .pipe(sass({
      loadPath: [paths.scss].concat(neat)
    }))
    .pipe(gulp.dest('./build/assets/stylesheets'));
});

// Coffeescript
gulp.task('javascripts', function() {
  return gulp.src(paths.coffee)
    .pipe(sourcemaps.init())
    .pipe(include())
    .pipe(coffee())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/assets/javascripts'));
});

coffeeStream = coffee({bare: true});
coffeeStream.on('error', function(err) {});

// Copy images
gulp.task('images', function () {
  gulp.src(paths.images)
    .pipe(gulp.dest('./build/assets/images'));
});

// Copy fonts
gulp.task('fonts', function () {
  gulp.src(paths.fonts)
    .pipe(gulp.dest('./build/assets/fonts'));
});

// Live Previews
var livereload;
gulp.task('livereload', function() {
  livereload = require('tiny-lr')();
  livereload.listen(4002);
});

function notifyLiveReload(event) {
  var fileName = require('path').relative('./', event.path);

  livereload.changed({
    body: {
      files: [fileName]
    }
  });
}

gulp.task('watch', function() {
  gulp.watch(paths.haml, ['views']);
  gulp.watch(paths.scss, ['stylesheets']);
  gulp.watch(paths.coffee, ['javascripts']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.fonts, ['fonts']);
  gulp.watch('./build/*.html', notifyLiveReload);
  gulp.watch('./build/assets/stylesheets/*.css', notifyLiveReload);
  gulp.watch('./build/assets/javascripts/*.js', notifyLiveReload);
  gulp.watch('./build/assets/images/*', notifyLiveReload);
  gulp.watch('./build/assets/fonts/*', notifyLiveReload);
});

// Run
gulp.task('default', ['views', 'stylesheets', 'javascripts', 'images', 'fonts', 'express', 'livereload', 'watch'], function() {

});

// Deploy
gulp.task('deploy', function () {
  return gulp.src("./build/**/*")
    .pipe(deploy())
});
