'use strict';
var gulp = require('gulp');
var runSequence = require('gulp-run-sequence');
var browserify = require('gulp-browserify');
var sourcemaps = require('gulp-sourcemaps');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var httpServer = require('http-server');
var minify = require('gulp-minify-css');
var contentInclude = require('gulp-content-includer');
var imagemin = require('gulp-imagemin');
var del = require('del');
var $ = require('gulp-load-plugins')();
//导入包信息文件
var pkg = require('./package.json');
//项目配置文件
var config = {
	path: {
		html: './src/*.html',
		layout:'./src/layout/*.html',
		mainjs: './src/js/main.js',
		js:'./src/js/*.js',
		images: './src/images/**/*',
		mainless:'./src/less/main.less',
		less: './src/less/*.less',
		json:'./src/json/**/*',
		fonts: './src/fonts/**/*',
		data: './src/data/**/*'
	},
	dist: {
		root: './dist',
		js: './dist/js',
		lib:'./dist/lib',
		css: './dist/css',
		json:'./dist/json',
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
//jquery
gulp.task('copy:jquery',function () {
	gulp.src('./node_modules/jquery/dist/**/*').pipe(gulp.dest(config.dist.lib+'/jquery'));
});
//amazeui
gulp.task('copy:amazeui',function () {
	gulp.src('./node_modules/amazeui/dist/js/**/*').pipe(gulp.dest(config.dist.lib+'/amazeui'));
	gulp.src('./node_modules/amazeui/dist/fonts/**/*').pipe(gulp.dest(config.dist.fonts));
});
//handlebars
gulp.task('copy:handlebars',function () {
	gulp.src('./node_modules/handlebars/dist/**/*').pipe(gulp.dest(config.dist.lib+'/handlebars'));
});
//fonts
gulp.task('copy:fonts',function () {
	gulp.src(config.path.fonts).pipe(gulp.dest(config.dist.fonts));
});
//images
gulp.task('build:images',function () {
	gulp.src(config.path.images).pipe(imagemin()).pipe(gulp.dest(config.dist.images));
});
//json
gulp.task('copy:json',function () {
	gulp.src(config.path.json).pipe(gulp.dest(config.dist.json));
});
//data
gulp.task('copy:data',function () {
	gulp.src(config.path.data).pipe(gulp.dest(config.dist.data));
});
//less
gulp.task('build:less',function () {
	gulp.src(config.path.mainless).pipe(sourcemaps.init()).pipe($.header(banner,{pkg:pkg,ver:''})).pipe($.plumber({errorHandler:function (err) {
		console.log(err);
		this.emit('end');
	}})).pipe($.less()).pipe($.autoprefixer({browsers:config.AUTOPREFIXER_BROWSERS})).pipe(gulp.dest(config.dist.css)).pipe(minify()).pipe($.rename({
		'suffix': '.min',
		'extname': '.css'
	})).pipe(sourcemaps.write('./')).pipe(gulp.dest(config.dist.css));
});
//js
gulp.task('build:js',function () {
	gulp.src(config.path.mainjs).pipe(sourcemaps.init()).pipe(browserify()).pipe($.header(banner,{pkg:pkg,ver:''})).pipe($.plumber({errorHandler:function(err){
		console.log(err);
		this.emit('end');
	}})).pipe(jshint()).pipe(gulp.dest(config.dist.js)).pipe(uglify()).pipe($.rename({
		'suffix': '.min',
		'extname': '.js'
	})).pipe(sourcemaps.write('./')).pipe(gulp.dest(config.dist.js));
});
//html
gulp.task('build:html',function () {
	gulp.src(config.path.html).pipe(contentInclude({
		includerReg:/<!\-\-include\s+"([^"]+)"\-\->/g
	})).pipe(gulp.dest(config.dist.root));
});
gulp.task('copy:lib',function (cb) {
	runSequence(['copy:jquery','copy:amazeui','copy:handlebars'],cb);
});
gulp.task('copy:src',function (cb) {
	runSequence(['copy:fonts','build:images','copy:data','copy:json'],cb);
});
gulp.task('build:src',function (cb) {
	runSequence(['build:less','build:js','build:html'],cb);
});
gulp.task('clean', function() {
	return del([config.dist.root]);
});
gulp.task('build', function(cb) {
	runSequence(['copy:lib','copy:src','build:src'], cb);
});
gulp.task('watch', function() {
	gulp.watch([config.path.html,config.path.layout],['build:html']);
	gulp.watch(config.path.js,['build:js']);
	gulp.watch(config.path.less,['build:less']);
	gulp.watch(config.path.fonts,['copy:fonts']);
	gulp.watch(config.path.images,['build:images']);
	gulp.watch(config.path.data,['copy:data']);
});
gulp.task('run', function() {
	var server = httpServer.createServer({
		root: './dist'
	});
	server.listen(81);
	console.log('http://localhost:81');
});
gulp.task('default', ['build','run','watch']);