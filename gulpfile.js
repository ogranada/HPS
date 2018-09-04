
const cp = require('child_process');
const gulp = require('gulp4');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');

const rollup = require('gulp-better-rollup');
const babelCli = require('rollup-plugin-babel');

gulp.task('build-server', () =>
  gulp.src([
    'src/**/*.js',
    '!src/public/**/*.js',
    '!src/__tests__/**/*.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env'],
      plugins: ['@babel/transform-runtime']
    }))
    .on('error', function (e) {
      global.console.log('>>> ERROR', e.message);
      this.emit('end');
    })
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'))
);

gulp.task('build-client', () =>
  gulp.src([
    'src/public/**/*.js'
  ])
    .pipe(rollup({
      plugins: [
        babelCli({
          babelrc: false,
          plugins: [
            '@babel/plugin-transform-runtime'
          ],
          runtimeHelpers: true,
          externalHelpers: false
        })
      ]
    }, {
      format: 'umd',
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/public'))
);

gulp.task('copy-js-files', () =>
  gulp.src([
    './node_modules/chart.js/dist/Chart.bundle.min.js',
    './node_modules/axios/dist/axios.min.js'
  ])
    .pipe(gulp.dest('dist/public/scripts'))
);

gulp.task('copy-template-files', () =>
  gulp.src('src/views/**/*.html')
    .pipe(gulp.dest('dist/views'))
);

gulp.task('watch', () => {
  gulp.watch(['src/**/*.js','!src/public/**/*.js'], gulp.parallel('build-server'));
  gulp.watch('src/public/**/*.js', gulp.parallel('build-client'));
  gulp.watch('src/views/**/*.html', gulp.parallel('copy-template-files'));
});

gulp.task('clean-old', (done) => {
  try {
    cp.exec('rm -Rf dist', () => {
      done();
    });
  } catch (error) {
    done();
  }
});

gulp.task('build', gulp.series('clean-old', gulp.parallel('build-client', 'build-server', 'copy-js-files', 'copy-template-files')));
gulp.task('develop', gulp.parallel('build', 'watch'));
gulp.task('default', gulp.parallel('develop'));
