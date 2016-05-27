'use strict';
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var minify = require('gulp-minify-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var browserify = require('gulp-browserify');
var runSequence = require('run-sequence');
var httpServer = require('http-server');
var $ = require('gulp-load-plugins')();
var pkg = require('./package.json');
var config = {
	path: {
		html: './src/*.html',
		js: './src/js/main.js',
		js_pugin:'./src/js/pugin/**/*',
		images: './src/images/**/*',
		css:'./src/css/**/*',
		less: './src/less/main.less',
		fonts: './src/fonts/**/*',
		data: './src/data/**/*',
		buildTmp: {
			js: '.build/temp/js'
		}
	},
	dist: {
		html: './dist',
		js: './dist/js',
		css: './dist/css',
		fonts: './dist/fonts',
		images: './dist/images',
		data: './dist/data'
	},
	AUTOPREFIXER_BROWSERS: [
		'ie >= 8',
		'ie_mob >= 10',
		'ff >= 30',
		'chrome >= 34',
		'safari >= 7',
		'opera >= 23',
		'ios >= 7',
		'android >= 2.3',
		'bb >= 10'
	]
};
var dateFormat = 'UTC:yyyy-mm-dd"T"HH:mm:ss Z';
var banner = [
	'/*! <%= pkg.name %> v<%= pkg.version %><%=ver%>',
	'by DMAX Team',
	'<%= pkg.homepage %>',
	'(c) ' + $.util.date(Date.now(), 'UTC:yyyy') + ' DMAX, Inc.',
	'<%= pkg.license.type %>',
	$.util.date(Date.now(), dateFormat) + ' */ \n'
].join(' | ');

gulp.task('copy:amazeui:js', function() {
	gulp.src('./node_modules/amazeui/dist/js/amazeui.min.js').pipe(gulp.dest(config.dist.js));
});
gulp.task('copy:amazeui:fonts', function() {
	gulp.src('./node_modules/amazeui/dist/fonts/*').pipe(gulp.dest(config.dist.fonts));
});
gulp.task('copy:amazeui:css', function() {
	gulp.src('./node_modules/amazeui/dist/css/amazeui.min.css').pipe(gulp.dest(config.dist.css));
});
gulp.task('copy:jquery', function() {
	gulp.src('./node_modules/jquery/dist/jquery.min.map').pipe(gulp.dest(config.dist.js));
	gulp.src('./node_modules/jquery/dist/jquery.min.js').pipe(gulp.dest(config.dist.js));
});
gulp.task('copy:data', function() {
	gulp.src(config.path.data).pipe(gulp.dest(config.dist.data));
});
gulp.task('copy:images', function() {
	gulp.src(config.path.images).pipe(imagemin()).pipe(gulp.dest(config.dist.images));
});
gulp.task('copy:fonts', function() {
	gulp.src(config.path.fonts).pipe(gulp.dest(config.dist.fonts));
});
gulp.task('copy:css',function(){
	gulp.src(config.path.css).pipe(gulp.dest(config.dist.css));
});
gulp.task('copy:pugin',function(){
	gulp.src(config.path.js_pugin).pipe(gulp.dest(config.dist.js));
});
gulp.task('copy:html', function() {
	gulp.src(config.path.html).pipe(gulp.dest(config.dist.html));
});
gulp.task('clean', function() {
	gulp.src(config.dist.html).pipe(clean());
});
gulp.task('build:js', function() {
	gulp.src(config.path.js).pipe(jshint()).pipe(rename({
		'extname': '.js'
	})).pipe(gulp.dest(config.dist.js)).pipe(uglify()).pipe(rename({
		'suffix': '.min',
		'extname': '.js'
	})).pipe(gulp.dest(config.dist.js));
});
gulp.task('build:less', function() {
	gulp.src(config.path.less).pipe($.header(banner, {
		pkg: pkg,
		ver: ''
	})).pipe(less()).pipe(rename({
		'extname': '.css'
	})).pipe(gulp.dest(config.dist.css)).pipe(minify()).pipe(rename({
		'suffix': '.min',
		'extname': '.css'
	})).pipe(gulp.dest(config.dist.css));
});
gulp.task('build', function(cb) {
	runSequence(['copy:amazeui:js', 'copy:amazeui:fonts','copy:amazeui:css', 'copy:jquery', 'copy:data', 'copy:images', 'copy:fonts','copy:css','copy:pugin', 'copy:html', 'build:less', 'build:js'], cb);
});
gulp.task('watch', function() {
	gulp.watch(config.path.html, ['copy:html']);
	gulp.watch(config.path.fonts, ['copy:fonts']);
	gulp.watch(config.path.images, ['copy:images']);
	gulp.watch(config.path.data, ['copy:data']);
	gulp.watch('./src/less/*.less', ['build:less']);
	gulp.watch(config.path.js, ['build:js']);
});
gulp.task('run', function() {
	var server = httpServer.createServer({
		root: './dist'
	});
	server.listen(81);
});
gulp.task('default', ['build', 'run', 'watch']);