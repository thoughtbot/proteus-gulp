var gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  bourbon = require('node-bourbon'),
  browsersync = require('browser-sync'),
  concat = require('gulp-concat'),
  coffee = require('gulp-coffee'),
  deploy = require('gulp-gh-pages'),
  haml = require('gulp-ruby-haml'),
  include = require('gulp-include'),
  neat = require('node-neat').includePaths,
  sass = require('gulp-ruby-sass'),
  sourcemaps = require('gulp-sourcemaps');

var paths = {
  haml: './source/views/*.haml',
  coffee: './source/assets/javascripts/**/*.coffee',
  scss: './source/assets/stylesheets/**/*.scss',
  images: './source/assets/images/*',
  fonts: './source/assets/fonts/*'
};

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
      loadPath: [paths.scss].concat(neat),
      "sourcemap=none": true
    }))
    .pipe(autoprefixer())
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

// Server
gulp.task('server', function() {
  browsersync({
    server: {
      baseDir: "./build",
    },
    port: 4000,
    notify: false,
    open: false
  });
});

gulp.task('watch', function() {
  gulp.watch(paths.haml, ['views']);
  gulp.watch(paths.scss, ['stylesheets']);
  gulp.watch(paths.coffee, ['javascripts']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.fonts, ['fonts']);
  gulp.watch('./build/*.html', browsersync.reload);
  gulp.watch('./build/assets/stylesheets/*.css', browsersync.reload);
  gulp.watch('./build/assets/javascripts/*.js', browsersync.reload);
  gulp.watch('./build/assets/images/*', browsersync.reload);
  gulp.watch('./build/assets/fonts/*', browsersync.reload);
});

// Run
gulp.task('default', ['views', 'stylesheets', 'javascripts', 'images', 'fonts', 'server', 'watch'], function() {

});

// Deploy
gulp.task('deploy', function () {
  return gulp.src("./build/**/*")
    .pipe(deploy({
      branch: "master"
    }));
});
