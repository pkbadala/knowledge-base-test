const gulp = require('gulp');
// const rename = require("gulp-rename");
// const clean = require('gulp-clean');
// const sequence = require('gulp-sequence');
// const sourcemaps = require('gulp-sourcemaps');

var imagemin = require('gulp-imagemin');
/*########################
# Images Tasks #
#########################*/
/* Images minigy task*/
gulp.task('imagemin', function() {
    var imgSrc = 'src/assets/images/*',
    imgDst = 'dist/assets/images';
    gulp.src(imgSrc)
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});

gulp.task('default', ['imagemin']);