### Mac环境下gulp 多张图片自动合成sprite图片

- 1、安装nodejs，直接到 [Nodejs官网](https://nodejs.org) 下载安装包，双击安装即可。

- 2、创建工程目录,准备好放图片的目录
```
$ cd
$ mkdir ~/Desktop/gulp_project
$ cd ~/Desktop/gulp_project
$ mkdir images
```
- 3、把需要用到的图片放到~/Desktop/gulp_project/images目录下
- 4、开始,输入以下简单几条命令即可搞定
```
$ cnpm install --global gulp-cli //安装全局gulp
$ cnpm init //生成package.json文件,可以一直按Enter
$ cnpm install gulp //安装本地gulp模块
$ cnpm install --save-dev gulp.spritesmith //安装sprite模块
```
	- 4.1 编写gulpfile.js
```
var gulp=require('gulp'),spritesmith=require('gulp.spritesmith'); //引入gulp和gulp.spritesmith模块
gulp.task('default', function () {
	return gulp.src('images/*.png')//需要合并的图片地址，此处为png后缀的图片
	       .pipe(spritesmith({
	           imgName: 'images/sprite.png',//保存合并后图片的地址
	           cssName: 'css/sprite.css',//保存合并后对于css样式的地址
	           padding:5,//合并时两个图片的间距
	       }))
	       .pipe(gulp.dest('dist/')); //最终结果放在哪里
});
``` 
	- 4.2 运行
```
$ gulp //在工程目录下执行
```
到目录~/Desktop/gulp_project/dist下查看结果，生成了两个文件（css/sprite.css和images/sprite.png）

	    - css/sprite.css
```
/*
Icon classes can be used entirely standalone. They are named after their original file names.

Example usage in HTML:

`display: block` sprite:
<div class="icon-home"></div>

To change `display` (e.g. `display: inline-block;`), we suggest using a common CSS class:

// CSS
.icon {
  display: inline-block;
}

// HTML
<i class="icon icon-home"></i>
*/
.icon-action_btn_inner_dot {
  background-image: url(../images/sprite.png);
  background-position: 0px -47px;
  width: 40px;
  height: 8px;
}
.icon-action_btn_no_dot {
  background-image: url(../images/sprite.png);
  background-position: 0px 0px;
  width: 70px;
  height: 42px;
}
.icon-action_btn_with_dot {
  background-image: url(../images/sprite.png);
  background-position: -75px 0px;
  width: 70px;
  height: 42px;
}

```
		- 图片images/sprite.png 

![](https://raw.githubusercontent.com/imoowi/dev/main/%E6%9E%B6%E6%9E%84%E5%B8%88%E7%AC%94%E8%AE%B0/img/sprite.png)

- Demo下载地址:[https://pan.baidu.com/s/174Es9BS9I9bvSinPd3FqLw](https://pan.baidu.com/s/174Es9BS9I9bvSinPd3FqLw) 提取码: uvve

Enjoy!
