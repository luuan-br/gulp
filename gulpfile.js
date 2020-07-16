// require dependecies
const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const messager = require('gulp-messenger');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();

// config folder
const path = './arquivos';
const folderSass = './src/sass/*.scss';
const folderJs = './src/js/*.js';
const nameFileOutputJs = 'common-scripts.min.js';

// clean folder
const clearPathCss = './arquivos/*.css';
const clearPathJS = './arquivos/*.js';

// reader folder
const readerFolderSass = './src/sass/**/*.scss';
const readerFolderHtml = './*.html';
const readerFolderJS = './src/js/**/*js';

// compile scss into css
function style() {
	return gulp
		.src(folderSass)
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(path))
		.pipe(messager.flush.info('Process CSS Completed Successfully'))
		.pipe(browserSync.stream());
}

// compile, minify and join js files
function script() {
	return gulp
		.src(folderJs)
		.pipe(
			babel({
				comments: false,
				presets: ['@babel/env']
			})
		)
		.pipe(uglify())
		.on('error', err => console.log(err))
		.pipe(concat(nameFileOutputJs))
		.pipe(gulp.dest(path))
		.pipe(browserSync.stream());
}

// Removes files and folders.
function cleanFiles() {
	return gulp.src([clearPathJS, clearPathCss], { read: false }).pipe(clean());
}

// watches files
function watch() {
	browserSync.init({
		server: {
			baseDir: './'
		}
	});

	gulp.watch(readerFolderSass, style);
	gulp.watch(readerFolderHtml).on('change', browserSync.reload);
	gulp.watch(readerFolderJS, script);
}

gulp.task('appCSS', style);
gulp.task('appJS', script);
gulp.task('watch', watch);
gulp.task('build', gulp.series('appCSS', 'appJS'));
gulp.task('default', gulp.series('appCSS', 'appJS', 'watch'));

exports.script = script;
exports.style = style;
exports.watch = watch;
exports.clear = cleanFiles;
