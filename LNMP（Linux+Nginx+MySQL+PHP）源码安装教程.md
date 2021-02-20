# LNMP（Linux+Nginx+MySQL+PHP）源码安装教程
## 一、nginx-1.10.0
### 准备
- 1、zlib zlib-1.2.8.tar.gz(http://www.zlib.net)
- 2、pcre pcre-8.36.tar.bz2(http://www.pcre.org/)
- 3、openssl openssl-1.0.1j.tar.gz(http://www.openssl.org/)
- 4、nginx nginx-1.10.0.tar.gz(http://nginx.org/en/download.html)
（约定：所有的源码放在目录 /home/username/src，所有的操作权限都是在root权限下进行）

### 安装
```
$cd /home/username/src
```

	1、安装zlib

```	
$tar zxf zlib-1.2.8.tar.gz
$cd zlib-1.2.8
$./configure --static --prefix=/usr/local/zlib
$make
$make install
$cd ../

```
	
	2、安装openssl

```
$tar zxf openssl-1.0.1j.tar.gz
$cd openssl-1.0.1j
$./config --prefix=/usr/local/openssl -L/usr/local/zlib/lib -I/usr/local/zlib/include threads zlib enable-static-engine
$make
$make install
$cd ../
```

	3、安装pcre

```	
$tar jxf pcre-8.36.tar.bz2
$cd pcre-8.36
$./configure --prefix=/usr/local/pcre
$make
$make install
$cd ../
```

	4、安装nginx

```	
$tar zxf nginx-1.10.0.tar.gz
$cd nginx-1.10.0
$./configure --prefix=/usr/local/nginx --sbin-path=/usr/local/nginx/nginx --conf-path=/usr/local/nginx/nginx.conf --pid-path=/usr/local/nginx/nginx.pid --with-openssl=../openssl-1.0.1j --with-zlib=../zlib-1.2.8 --with-pcre=../pcre-8.36 --with-http_stub_status_module --with-http_gzip_static_module --with-http_ssl_module
$make
$make install
$cd ../
```

### 配置
	
### 1、配置nginx.conf

```
$vim /usr/local/nginx/nginx.conf
```

	打开nginx.conf文件，其内容如下：

```	
#user nobody;
worker_processes 1;

#error_log logs/error.log;
#error_log logs/error.log notice;
#error_log logs/error.log info;

#pid logs/nginx.pid;


events {
worker_connections 1024;
}


http {
include mime.types;
default_type application/octet-stream;

#log_format main '$remote_addr - $remote_user [$time_local] "$request" '
# '$status $body_bytes_sent "$http_referer" '
# '"$http_user_agent" "$http_x_forwarded_for"';

#access_log logs/access.log main;

sendfile on;
#tcp_nopush on;

#keepalive_timeout 0;
keepalive_timeout 65;

#gzip on;

server {
listen 80; //监听端口
server_name localhost; //服务器名

#charset koi8-r;

#access_log logs/host.access.log main;

location / {
root html; //web根目录
index index.html index.htm; //首页支持语言
}

#error_page 404 /404.html;

# redirect server error pages to the static page /50x.html
#
error_page 500 502 503 504 /50x.html;
location = /50x.html {
root html;
}

# proxy the PHP scripts to Apache listening on 127.0.0.1:80
#
#location ~ \.php$ {
# proxy_pass http://127.0.0.1;
#}

# pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
#
#location ~ \.php$ {
# root html;
# fastcgi_pass 127.0.0.1:9000;
# fastcgi_index index.php;
# fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
# include fastcgi_params;
#}

# deny access to .htaccess files, if Apache's document root
# concurs with nginx's one
#
#location ~ /\.ht {
# deny all;
#}
}


# another virtual host using mix of IP-, name-, and port-based configuration
#
#server {
# listen 8000;
# listen somename:8080;
# server_name somename alias another.alias;

# location / {
# root html;
# index index.html index.htm;
# }
#}


# HTTPS server
#
#server {
# listen 443 ssl;
# server_name localhost;

# ssl_certificate cert.pem;
# ssl_certificate_key cert.key;

# ssl_session_cache shared:SSL:1m;
# ssl_session_timeout 5m;

# ssl_ciphers HIGH:!aNULL:!MD5;
# ssl_prefer_server_ciphers on;

# location / {
# root html;
# index index.html index.htm;
# }
#}

}
```

	进行以上配置之后，打开nginx服务
```
$./nginx
```

	这样服务器就打开了，在本机浏览器输入localhost，即可看见nginx的欢迎页面,如果想要关闭nginx服务，则输入以下命令：

```
$./nginx -s stop
```

### 2、配置防火墙

	如果想要外网能够访问我们的web服务，则需要添加防火墙规则

```
$vim /etc/sysconfig/iptables
```

	加入以下规则：

```
-A INPUT -m state --state NEW -m tcp -p tcp --dport 80 -j ACCEPT
```

```
$/etc/init.d/iptables restart #重启防火墙使其配置生效
```

	这样，就可以从外网访问我们的web服务了

```
centos7:
查看80端口：# firewall-cmd --query-port=80/tcp
开启80端口：# firewall-cmd --zone=public --add-port=80/tcp --permanent
```

### 3、加入系统服务
	vim /etc/init.d/nginx,加入以下内容：

```
#!/bin/sh 
# 
# nginx - this script starts and stops the nginx daemon 
# 
# chkconfig: - 85 15 
# description: Nginx is an HTTP(S) server, HTTP(S) reverse 
# proxy and IMAP/POP3 proxy server 
# processname: nginx 
# config: /usr/local/nginx/nginx.conf 
# config: /usr/local/nginx/nginx 
# pidfile: /usr/local/nginx/nginx.pid 

# Source function library. 
. /etc/rc.d/init.d/functions 

# Source networking configuration. 
. /etc/sysconfig/network 

# Check that networking is up. 
[ "$NETWORKING" = "no" ] && exit 0 

# 这里要根据实际情况修改
nginx="/usr/local/nginx/nginx" 
prog=$(basename $nginx) 

# 这里要根据实际情况修改
NGINX_CONF_FILE="/usr/local/nginx/nginx.conf" 

[ -f /etc/sysconfig/nginx ] && . /etc/sysconfig/nginx 

lockfile=/var/lock/subsys/nginx 

start() { 
[ -x $nginx ] || exit 5 
[ -f $NGINX_CONF_FILE ] || exit 6 
echo -n $"Starting $prog: " 
daemon $nginx -c $NGINX_CONF_FILE 
retval=$? 
echo 
[ $retval -eq 0 ] && touch $lockfile 
return $retval 
} 

stop() { 
echo -n $"Stopping $prog: " 
killproc $prog -QUIT 
retval=$? 
echo 
[ $retval -eq 0 ] && rm -f $lockfile 
return $retval 
killall -9 nginx 
} 

restart() { 
configtest || return $? 
stop 
sleep 1 
start 
} 

reload() { 
configtest || return $? 
echo -n $"Reloading $prog: " 
killproc $nginx -HUP 
RETVAL=$? 
echo 
} 

force_reload() { 
restart 
} 

configtest() { 
$nginx -t -c $NGINX_CONF_FILE 
} 

rh_status() { 
status $prog 
} 

rh_status_q() { 
rh_status >/dev/null 2>&1 
} 

case "$1" in 
start) 
rh_status_q && exit 0 
$1 
;; 
stop) 
rh_status_q || exit 0 
$1 
;; 
restart|configtest) 
$1 
;; 
reload) 
rh_status_q || exit 7 
$1 
;; 
force-reload) 
force_reload 
;; 
status) 
rh_status 
;; 
condrestart|try-restart) 
rh_status_q || exit 0 
;; 
*) 
echo $"Usage: $0 {start|stop|status|restart|condrestart|try-restart|reload|force-reload|configtest}" 
exit 2 
esac
```

```
chmod 755 /etc/init.d/nginx
chkconfig nginx on
chkconfig --list

启动nginx：service nginx start
停止nginx：service nginx stop
重启nginx服务：service nginx reload

```

## 二、mysql5.7.16:

```
shell> tar zxf mysql-5.7.12.tar.gz
shell> cd mysql-5.7.12
shell> cmake -DCMAKE_INSTALL_PREFIX=/usr/local/mysql -DMYSQL_UNIX_ADDR=/usr/local/mysql/mysql.sock -DDEFAULT_CHARSET=utf8 -DDEFAULT_COLLATION=utf8_general_ci -DWITH_MYISAM_STORAGE_ENGINE=1 -DWITH_INNOBASE_STORAGE_ENGINE=1 -DWITH_MEMORY_STORAGE_ENGINE=1 -DWITH_READLINE=1 -DENABLED_LOCAL_INFILE=1 -DMYSQL_DATADIR=/data/mysql -DMYSQL_USER=mysql -DMYSQL_TCP_PORT=3306 -DDOWNLOAD_BOOST=1 -DWITH_BOOST=/home/username/src/mysql-5.7.16/boost
shell>make
shell>make install

shell> groupadd mysql
shell> useradd -r -g mysql -s /bin/false mysql
shell> cd /usr/local
shell> tar zxvf /path/to/mysql-VERSION-OS.tar.gz
shell> ln -s full-path-to-mysql-VERSION-OS mysql
shell> cd mysql
shell> mkdir mysql-files
shell> chmod 750 mysql-files
shell> chown -R mysql .
shell> chgrp -R mysql .
shell> bin/mysql_install_db --user=mysql    # Before MySQL 5.7.6
shell> bin/mysqld --initialize --user=mysql # MySQL 5.7.6 and up
shell> bin/mysql_ssl_rsa_setup              # MySQL 5.7.6 and up
shell> chown -R root .
shell> chown -R mysql data mysql-files
shell> bin/mysqld_safe --user=mysql &
# Next command is optional
shell> cp support-files/mysql.server /etc/init.d/mysql.server


mysql password : 111111
```

## 三、php7.0.6:

```
shell>yum -y install libjpeg libjpeg-devel libpng libpng-devel freetype freetype-devel libxml2 libxml2-devel pcre-devel
```
```
 shell>yum -y install curl-devel
```
```
 shell>yum -y install libxslt-devel
```
```
 shell>tar zxf php-7.0.6.tar.gz
```
```
 shell>cd php-7.0.6
```
```
 shell>./configure --prefix=/usr/local/php \
 --with-curl \
 --with-freetype-dir \
 --with-gd \
 --with-gettext \
 --with-iconv-dir \
 --with-kerberos \
 --with-libdir=lib64 \
 --with-libxml-dir \
 --with-mysqli \
 --with-openssl \
 --with-pcre-regex \
 --with-pdo-mysql \
 --with-pdo-sqlite \
 --with-pear \
 --with-png-dir \
 --with-jpeg-dir \
 --with-xmlrpc \
 --with-xsl \
 --with-zlib \
 --enable-fpm \
 --enable-bcmath \
 --enable-libxml \
 --enable-inline-optimization \
 --enable-gd-native-ttf \
 --enable-mbregex \
 --enable-mbstring \
 --enable-opcache \
 --enable-pcntl \
 --enable-shmop \
 --enable-soap \
 --enable-sockets \
 --enable-sysvsem \
 --enable-xml \
 --enable-zip
```
```
 shell>make &&  make install
```
```
 shell>cp php.ini-development /usr/local/php/lib/php.ini
```
```
 shell>cp /usr/local/php/etc/php-fpm.conf.default /usr/local/php/etc/php-fpm.conf
```
```
 shell>cp /usr/local/php/etc/php-fpm.d/www.conf.default /usr/local/php/etc/php-fpm.d/www.conf
```
```
 shell>cp -R ./sapi/fpm/php-fpm /etc/init.d/php-fpm
```

	启动
```
 shell> /etc/init.d/php-fpm 
```
