'use strict';

const gulp = require('gulp'),
    sass = require('gulp-sass'),
    gzip = require('gulp-gzip'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    imagemin = require('gulp-imagemin'),
    clean = require('gulp-clean'),
    runSequence = require('run-sequence'),
    sassLint = require('gulp-sass-lint'),
    gulpCopy = require('gulp-copy'),
    destination = './assets';


const imgToCompress = './images/**/*';

gulp.task('clean', function () {
    return gulp.src(`${destination}/*`)
        .pipe(clean());
});

gulp.task('sass', function () {
  return gulp.src('./stylesheets/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest(`${destination}/stylesheets`));
});

gulp.task('autoprefixer', function () {
  const cssDest = `${destination}/stylesheets/*.css`,
        cssMin = `${destination}/stylesheets`; 

  return gulp.src(cssDest)
    .pipe(postcss([autoprefixer({ browsers: ['last 2 versions'], cascade: false })]))
    .pipe(gulp.dest(cssMin));
});

gulp.task('imagemin', function () {
  return gulp.src('./images/**/*')
    .pipe(imagemin([
      imagemin.jpegtran({optimizationLevel: 5}),
      imagemin.svgo({plugins: [{removeViewBox: true}]})
    ], {verbose: true}
    ))
		.pipe(gulp.dest(`${destination}/images`));
});

gulp.task('sasslint', function () {
  return gulp.src('stylesheets/**/*.scss')
    .pipe(sassLint({
      rules: {
        'no-transition-all': 0,
        'no-ids': 1
      },
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
});


gulp.task('watch', function () {
  gulp.watch('stylesheets/**/*.scss', ['sasslint', 'sass', 'autoprefixer']);
});

gulp.task('default', function () {
  runSequence('clean',
              ['sasslint', 'sass', 'imagemin'],
              'autoprefixer'
              );
});
