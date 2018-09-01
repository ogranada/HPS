
const gulp = require('gulp4');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('build-server', () =>
  gulp.src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .on('error', function(e) {
      global.console.log('>>> ERROR', e.message);
      this.emit('end');
    })
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'))
);

gulp.task('watch', () => {
  gulp.watch('src/**/*.js', gulp.series('build-server'));
});

gulp.task('develop', gulp.parallel('build-server', 'watch'));

gulp.task('default', gulp.series('develop'));
