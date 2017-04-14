var gulp = require('gulp');
var connect = require('gulp-connect');
var browserify = require('browserify');
var source = require('vinyl-source-stream'); 

gulp.task('connect', function() {
  connect.server({
    root: './',
    livereload: true,
    port:8004
  });
});

gulp.task('html', function () {
  gulp.src('./*.html')
    .pipe(connect.reload());
});

/* browserify */ 
gulp.task('browserify', function() {
  browserify({
    entries: './spec/CgpaSpec.js',
    debug: true
  })
  .bundle()
  .pipe(source('bundleSpec.js'))
  .pipe(gulp.dest('./bundle/'));
});
 
gulp.task('watch', function () {
  gulp.watch(['./*.html'], ['html']);
   gulp.watch(['./spec/*.js','./src/*.js'], ['browserify', 'html']);
});
 
gulp.task('default', ['connect', 'browserify', 'watch']);

