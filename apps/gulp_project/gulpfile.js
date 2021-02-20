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
