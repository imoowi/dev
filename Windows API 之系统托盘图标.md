# Windows API 之系统托盘图标

##### 首先打开vc6，建立一个基于Win32的新工程“NotifyIcon”，如下图：
![](http://simple.imoowi.com/usr/uploads/2016/11/3906462080.gif)

##### 点击“OK”往下
![](http://simple.imoowi.com/usr/uploads/2016/11/2640866149.gif)
##### 选择“A typical “Hello World!” application.”，点击“Finish”，得到新工程的信息，如下图
![](http://simple.imoowi.com/usr/uploads/2016/11/1315085953.gif)
##### 点击“OK”进入工作空间，选择类视图，展开类文件，双击“InitInstance(...”进行代码编写，如下图
![](http://simple.imoowi.com/usr/uploads/2016/11/921859710.gif)
##### 要加入托盘图标，首先需要包含“shellapi.h”头文件，如图
![](http://simple.imoowi.com/usr/uploads/2016/11/2768870643.gif)
##### 然后开始加入以下代码，如图
![](http://simple.imoowi.com/usr/uploads/2016/11/3118980912.gif)
##### 按F5，运行我的应用，就可以看见系统托盘有了，如图
![](http://simple.imoowi.com/usr/uploads/2016/11/1328773918.gif)
##### 第一个图标就是我的图标了，鼠标放上去还有tip出现，是不是很兴奋？

	别急，最后我们的应用退出的时候，需要把这个图标删掉，否则就不美观了。
	在“LRESULT CALLBACK WndProc(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam)”里面加入如下图的代码
![](http://simple.imoowi.com/usr/uploads/2016/11/2833053650.gif)
##### 按F7编译，发现上图的错误，说“icondata”没有定义，是因为先前定义的“icondata”为局部变量，如果其他地方也需要用到这个变量，那么最好定义为全局变量，所以我们只需要稍作修改就可以了，那就是把现在定义的”icondata“放到文件的前面，作为全局变量，这样任何类方法都可以用了，如下图
![](http://simple.imoowi.com/usr/uploads/2016/11/2613091732.gif)
##### 对应的InitInstance方法里也就会做相应变化，如图：
![](http://simple.imoowi.com/usr/uploads/2016/11/2156521819.gif)
##### 再次运行程序，通过，大功告成！享受你的系统托盘图标吧！
	
	源码下载地址：http://download.csdn.net/detail/simpleiseasy/3793740