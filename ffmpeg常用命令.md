
#FFMPEG视频操作常用命令
##1、格式转换
- 普通转
```
ffmpeg -i input.mov -vcodec libx264 -y output.mp4
```
- 固定帧率
```
ffmpeg -i input.mov -vcodec libx264 -qscale 0 -r 24 -y output.mp4
ffmpeg -i input.mp4  -c:v libx264 -c:a aac output.mp4
```

##2、旋转
- 顺时针旋转画面90度
```
ffmpeg -i test.mp4 -vf "transpose=1" out.mp4
```
- 逆时针旋转画面90度
```
ffmpeg -i test.mp4 -vf "transpose=2" out.mp4
```
- 顺时针旋转画面90度再水平翻转
```
ffmpeg -i test.mp4 -vf "transpose=3" out.mp4
```
- 逆时针旋转画面90度水平翻转
```
ffmpeg -i test.mp4 -vf "transpose=0" out.mp4
```
- 水平翻转视频画面
```
ffmpeg -i test.mp4 -vf hflip out.mp4
```
- 垂直翻转视频画面
```
ffmpeg -i test.mp4 -vf vflip out.mp4
```

##3、生成 m3u8 文件
- 将MP4转成ts
```
ffmpeg -i Aventador.mp4 -codec copy -bsf h264_mp4toannexb Aventador.ts
```
- 将ts转成m3u8
```
ffmpeg -i Aventador.ts -c copy -map 0 -f segment -segment_list Aventador.m3u8 -segment_time 60 Aventador%06d.ts
```

##4、缩放视频
- 改变为源视频一半大小
```
ffmpeg -i input.mpg -vf scale=iw/2:ih/2 output.mp4
```
- 改变为原视频的90%大小：
```
ffmpeg -i input.mpg -vf scale=iw*0.9:ih*0.9 output.mp4
```

##5、合并视频
- 制作视频文件 filelist.txt，输入以下内容(已经存在的视频文件名列表):
```
file '1.mp4'
file '2.mp4'
file '3.mp4'
file '4.mp4'
```
- 执行命令，生成合成视频
```
ffmpeg -f concat -i filelist.txt -c copy merg.mp4
```

##6、剪切视频
```
ffmpeg -ss 00:00:00 -t 00:13:58 -i merg.mp4 -vcodec copy -acodec copy final_f.mp4
ffmpeg -ss 00:17:09 -t 00:20:29 -i merg.mp4 -vcodec copy -acodec copy final_e.mp4
```

##7、提取视频 mp3
```
ffmpeg -i input.mp4 -f mp3 -vn output.mp3	
```

##8、图片合成视频
```
ffmpeg -f image2 -stream_loop 100 -i noAccessVideo.jpg -vcodec libx264 -b:v 200k -r 10 -s 800x600 -acodec libfaac -y 4.mp4
```

##9、修改mp4meta信息到头部
```
qtfaststart input-540.mp4 output-540-head.mp4
```

<center>
[<img src="https://simple.imoowi.com/favicon.ico" width="24">](http://simple.imoowi.com)
&copy;2021 
*powerd by yuanjun*
</center>
