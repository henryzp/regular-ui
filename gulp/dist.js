var gulp = require('gulp');

var webpack = require('gulp-webpack');
var webpackConfig = require('../webpack.config.js');
var requireConvert = require('gulp-require-convert');
var rm = require('gulp-rimraf');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var sequence = require('run-sequence');

var mcss = require('../lib/gulp-mcss.js');

/**
 * ------------------------------------------------------------
 * Build Dist
 * ------------------------------------------------------------
 */

gulp.task('dist-clean', function(done) {
    return gulp.src('./dist', {read: false}).pipe(rm());
});

gulp.task('dist-copy', function(done) {
    return gulp.src('./src/font/**').pipe(gulp.dest('./dist/font'))
        && gulp.src([
            './node_modules/regularjs/dist/regular.min.js',
            './node_modules/marked/marked.min.js'
        ]).pipe(gulp.dest('./dist/vendor'))
});

gulp.task('dist-js', function(done) {
    return gulp.src('./src/js/index.js')
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest('./dist/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('dist-css', function(done) {
    var themes = ['default', 'flat', 'bootstrap'];

    var gulpCSS = function(theme) {
        return gulp.src('./src/mcss/' + theme + '.mcss')
            .pipe(mcss({
                pathes: ["./node_modules"],
                importCSS: true
            }))
            .pipe(rename('regular-ui.' + theme + '.css'))
            .pipe(gulp.dest('./dist/css'))
            .pipe(rename({suffix: '.min'}))
            .pipe(minifycss())
            .pipe(gulp.dest('./dist/css'));
    }
    
    return gulpCSS(themes[0]) && gulpCSS(themes[1]) && gulpCSS(themes[2]);
});

gulp.task('dist', function(done) {
    sequence('dist-clean', ['dist-copy', 'dist-js', 'dist-css'], done);
});

gulp.task('bower-clean', function(done) {
    return gulp.src([
        '../regular-ui-bower/*',
        '!../regular-ui-bower/bower.json',
        '!../regular-ui-bower/README.md'
    ], {read: false}).pipe(rm({force: true}));
});

gulp.task('bower-copy', function(done) {
    return gulp.src('./dist/**').pipe(gulp.dest('../regular-ui-bower'))
    && gulp.src('./src/js/**').pipe(gulp.dest('../regular-ui-bower/js-common'))
    && gulp.src('./src/mcss/**').pipe(gulp.dest('../regular-ui-bower/mcss'));
});

gulp.task('bower-js-amd', function(done) {
    return gulp.src('./src/js/**/*.html').pipe(gulp.dest('../regular-ui-bower/js-amd'))
        && gulp.src('./src/js/**/*.js')
        .pipe(requireConvert())
        .pipe(gulp.dest('../regular-ui-bower/js-amd'));
});

gulp.task('bower', function(done) {
    sequence(['dist', 'bower-clean'], ['bower-copy', 'bower-js-amd'], done);
});