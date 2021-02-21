# nginx-修改Response Headers里Server信息

##### 为了可以显示不同与nginx的信息，我们需要重新编译源码，修改Server信息很简单，只需要修改源码包中/src/core/nginx.h里的信息。

###### 我们以 nginx1.4.2 为例

```
vim /usr/local/src/nginx-1.4.2/src/core/nginx.h
```
	
###### 发现里面的内容如下:

```
* Copyright (C) Igor Sysoev
* Copyright (C) Nginx, Inc.
*/

#ifndef _NGINX_H_INCLUDED_
#define _NGINX_H_INCLUDED_


#define nginx_version 1004002
#define NGINX_VERSION "1.4.2"
#define NGINX_VER "nginx/" NGINX_VERSION

#define NGINX_VAR "NGINX"
#define NGX_OLDPID_EXT ".oldbin"

#endif /* _NGINX_H_INCLUDED_ */
```	

###### 接下来修改 NGINX_VERSION 和 NGINX_VER 这两个常量,修改为如下：

```
* Copyright (C) Igor Sysoev
* Copyright (C) Nginx, Inc.
*/

#ifndef _NGINX_H_INCLUDED_
#define _NGINX_H_INCLUDED_

#define nginx_version 1004002
#define NGINX_VERSION "1.0"
#define NGINX_VER "iis9.0/" NGINX_VERSION

#define NGINX_VAR "NGINX"
#define NGX_OLDPID_EXT ".oldbin"

#endif /* _NGINX_H_INCLUDED_ */
```	

###### 这里改为iis可以进行伪装。
