var autoprefixer = require('gulp-autoprefixer');
let cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var gulp = require('gulp');
var sass = require('gulp-sass');

// To match upstream Bootstrap's level of browser compatibility,
// set Autoprefixer's browsers option to:
var autoprefixerOptions = {
  Browserslist: [
      "Android 2.3",
      "Android >= 4",
      "Chrome >= 20",
      "Firefox >= 24",
      "Explorer >= 8",
      "iOS >= 6",
      "Opera >= 12",
      "Safari >= 6"
  ]
};

gulp.task('styles', function(){
  return gulp.src('assets/scss/styles.scss')
    .pipe(sass()) // Converts SASS to CSS with gulp-scss
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest('assets/css/'))
});

gulp.task('scripts', function() {
    return gulp.src([
      'assets/js/vendors/jquery.min.js',
      'assets/js/vendors/popper.min.js',
      'assets/js/vendors/bootstrap/util.js',
      'assets/js/vendors/bootstrap/modal.js',
      'assets/js/vendors/bootstrap/collapse.js',
      'assets/js/vendors/bootstrap/bootstrap-table.min.js',
      'assets/js/vendors/magnific-popup/jquery.magnific-popup.js',
      'assets/js/vendors/owlcarousel/owl.carousel.min.js',
      'assets/js/vendors/jquery.zoom.min.js',
      'assets/js/globalNav.js',
      'assets/js/main.js'
    ])
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('assets/js/dist/'));
});

// Register a watch task to listen for file updates
gulp.task('watch', function(){
  gulp.watch('assets/scss/**/*.scss',  gulp.series('styles'));
  gulp.watch('assets/js/*',  gulp.series('scripts'));
});
