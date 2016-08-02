使用Gulp开发基于Amazeui的项目。

# 构建工具
- gulp 

- gulp-browserify 浏览器端CommonJS规范

- browserify-shim

- gulp-autoprefixer 根据设置浏览器版本自动处理浏览器前缀

- del 清除文件

- gulp-concat 合并文件

- gulp-plumber 捕获错误

- gulp-header 文件头描述

- gulp-sourcemaps 生成sourcemaps

- gulp-imagemin 图片压缩

- gulp-jshint 和 jshint Javascript代码验证工具

- gulp-less。less编译工具

- gulp-load-plugins。gulp插件加载

- gulp-minify-css 或 gulp-clean-css 压缩css文件。gulp-minify-css已经被废弃，请使用gulp-clean-css

- gulp-rename，重命名

- gulp-uglify。压缩javascript文件

- gulp-util。帮助类，如日期处理。

- gulp-content-includer 或 gulp-file-include 。生成静态HTML文件从模板和内容文件

- gulp-utf8-convert 。

- http-server

- gulp-run-sequence 或 run-sequence。任务运行顺序。任务调度

- jquery

- handlebars。JS模板引擎

- amazeui

# 开发环境配置
> 如果在package.json文件中已经安装的可跳过。没有的需要安装。安装方式有两种，一种是直接修改package.json文件、另外一种是以安装的方式来更新package.json文件。直接修改package.json文件版本这块很难写，如果需要特殊版本我们才去修改package.json文件。如果package.json文件已经修改完成，需要使用npm install来安装依赖文件。

## 安装Gulp
在nodejs已经安装的情况下，我们可以使用`npm install -g gulp`来安装Gulp工具。

## 安装插件
安装插件需要切换到项目目录中去。
- ```npm install --save-dev gulp```
- ```npm install --save-dev gulp-browserify```
- ```npm install --save-dev browserify-shim```
- ```npm install --save-dev gulp-autoprefixer```
- ```npm install --save-dev del```
-``` npm install --save-dev gulp-sourcemaps```
- ```npm install --save-dev gulp-concat```
- ```npm install --save-dev gulp-plumber```
- ```npm install --save-dev gulp-header```
- ```npm install --save-dev gulp-imagemin```
- ```npm install --save-dev gulp-jshint```
- ```npm install --save-dev gulp-less```
- ```npm install --save-dev gulp-load-plugins```
- ```npm install --save-dev gulp-minify-css```
- ```npm install --save-dev gulp-rename```
- ```npm install --save-dev gulp-uglify```
- ```npm install --save-dev gulp-util```
- ```npm install --save-dev gulp-content-includer```
- ```npm install gulp-utf8-convert```
- ```npm install --save-dev gulp-run-sequence```
- ```npm install --save-dev jshint```
- ```npm install --save-dev http-server```
- ```npm install --save-dev jquery```
- ```npm install --save-dev handlebars```
- ```npm install --save-dev amazeui```

# 目录和文件说明
```
dir	`项目目录`
| src 	`开发源文件目录`
|-- index.html `首页文件`
|-- less 		`less文件目录`
|-- js 		`Javascript文件目录`
|-- images	`图片文件目录`
|-- fonts		`字体文件目录`
|-- layout  `布局文件目录`
|-- data	`数据文件目录`
| dist	`生成的页面目录`
```


# browserify配置
```
//js 使用browserify对js进行编译、打包、压缩、maps
gulp.task('build:js',function () {
	gulp.src(config.path.mainjs).pipe(sourcemaps.init()).pipe(browserify()).pipe($.header(banner,{pkg:pkg,ver:''})).pipe(jshint()).pipe(gulp.dest(config.dist.js)).pipe(uglify()).pipe($.rename({
		'suffix': '.min',
		'extname': '.js'
	})).pipe(sourcemaps.write('./')).pipe(gulp.dest(config.dist.js));
});
```
## 修改package.json
配置browserify-shim，进browserify打包时不加入Jquery，这样就可以通过外部引用使用Jquery
```
"browserify": {
    "transform": [
      "browserify-shim"
    ]
  },
  "browserify-shim": {
    "jquery": "global:jQuery"
  }
```

## 禁用响应式
不喜欢响应式？可以尝试禁用：
- 删除 head 里的视口设置 meta 标签；

```html
//注释掉
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
```
- 固定容器 `.am-container` 宽度（可以自己添加一个 class，不一定要使用内置的）：

```css
.am-container {
  width: 980px !important;
  max-width: none;
}
```
