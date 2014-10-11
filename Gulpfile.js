var gulp = require('gulp'),
  concat = require('gulp-concat'),
  haml = require('gulp-ruby-haml'),
  sass = require('gulp-ruby-sass'),
  neat = require('node-neat').includePaths;

var paths = {
  haml: './source/views/*.haml',
  js: './source/assets/javascripts/*.js',
  scss: './source/assets/stylesheets/*.scss'
};

gulp.task('express', function() {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')({port: 4002}));
  app.use(express.static('./build'));
  app.listen(4000);
});

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

gulp.task('views', function () {
  gulp.src(paths.haml)
    .pipe(haml())
    .pipe(gulp.dest('./build'));
});

gulp.task('stylesheets', function() {
  return gulp.src(paths.scss)
    .pipe(sass({
      loadPath: ['styles'].concat(neat)
    }))
    .pipe(gulp.dest('./build/assets/stylesheets'));
});

gulp.task('javascripts', function() {
  return gulp.src(paths.js)
    .pipe(concat('application.js'))
    .pipe(gulp.dest('./build/assets/javascripts'));
});

gulp.task('watch', function() {
  gulp.watch(paths.scss, ['stylesheets']);
  gulp.watch(paths.js, ['javascripts']);
  gulp.watch('index.html', notifyLiveReload);
  gulp.watch('./build/assets/javascripts/*.js', notifyLiveReload);
  gulp.watch('./build/assets/stylesheets/*.css', notifyLiveReload);
});

gulp.task('default', ['views', 'stylesheets', 'javascripts', 'express', 'livereload', 'watch'], function() {

});
