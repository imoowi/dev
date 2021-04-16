# Centos安装FFmpeg

- 1、首先安装系统编译环境

	```
	yum install -y automake autoconf libtool gcc gcc-c++ #CentOS
	```

- 2、编译所需源码包

```
#yasm：汇编器，新版本的ffmpeg增加了汇编代码
wget http://www.tortall.net/projects/yasm/releases/yasm-1.3.0.tar.gz
tar -xzvf yasm-1.3.0.tar.gz
cd yasm-1.3.0
./configure
make
make install

#lame：Mp3音频解码
wget http://jaist.dl.sourceforge.net/project/lame/lame/3.99/lame-3.99.5.tar.gz
tar -xzvf lame-3.99.5.tar.gz
cd lame-3.99.5
./configure
make
make install

#amr支持
wget http://downloads.sourceforge.net/project/opencore-amr/opencore-amr/opencore-amr-0.1.3.tar.gz
tar -xzvf opencore-amr-0.1.3.tar.gz
cd opencore-amr-0.1.3
./configure
make
make install

#amrnb支持
wget http://www.penguin.cz/~utx/ftp/amr/amrnb-11.0.0.0.tar.bz2
tar -xjvf amrnb-11.0.0.0.tar.bz2
cd amrnb-11.0.0.0
./configure
make
make install

#amrwb支持
wget http://www.penguin.cz/~utx/ftp/amr/amrwb-11.0.0.0.tar.bz2
tar -xjvf amrwb-11.0.0.0.tar.bz2
cd amrwb-11.0.0.0
./configure
make
make install

#ffmpeg
wget https://ffmpeg.org/releases/ffmpeg-3.0.4.tar.bz2
tar -xjvf ffmpeg-3.0.4.tar.bz2
cd ffmpeg-3.0.4
./configure --enable-libmp3lame --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-version3 --enable-shared
make
make install

#加载配置
#最后写入config后，终端运行ffmpeg命令，出现success和已安装的扩展，则运行成功。
ldconfig
```

- 3、php调用ffmpeg权限问题
	- apache/Nginx下的PHP/Ruby可以直接Windows和Linux下的系统命令，在Linux下，一般只能执行普通用户对应的权限，如果要执行一下需要Sudo的命令，则需要进行一些配置。
	
	- 修改方式是将Webserver运行的用户名，加上sudo权限，这样php或者Ruby(以下就只写php了)就可以调用sudo及对应的命令了。

	- 一般来说，为了安全，需要指定这些用户可以执行哪些命令，方法是修改sudoers这个文件的配置。

	- 首先编辑 /etc/sudoers 使用 vim来编辑
	/etc/sudoers的权限是440：
	```
	-r–r—– 1 root root 3248 Oct 18 23:47 /etc/sudoers
	```
	需要
	```
	chmod u+w /etc/sudoers
	```
	- 修改完后再恢复原来的权限
	```
	chmod -w /etc/sudoers
	```
	- 因为如果/etc/sudoers的权限不是440，那么sudo会报错：
	```
	[root@hn ~]# sudo
	sudo: /etc/sudoers is mode 0640, should be 0440
	sudo: no valid sudoers sources found, quitting
	```
	- 在最下面添加一行
	```
	nobody ALL=NOPASSWD:/usr/local/squid/sbin/squid -k reconfigure
	```
		
		然后注释掉文件中的Defaults requiretty这行,否则会出现sudo: sorry, you must have a tty to run sudo的错误
	
		保存退出即可

	- 这里的nobody为WebServer运行的用户名，

		如httpd默认为apache,Nginx默认为nobody；

		ALL=NOPASSWD为执行sudo时不需要输入密码，即在非交互界面中直接执行命令；
		
		/usr/local/squid/sbin/squid -k reconfigure 则是将可以执行的完整命令。


	
参考网址：
	
- [linux下使用ffmpeg将amr转成mp3](https://my.oschina.net/ethan09/blog/372435)

- [apache/Nginx下的PHP/Ruby执行sudo权限的系统命令](http://www.4wei.cn/archives/1001469)
