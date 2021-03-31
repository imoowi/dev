#更新系统资源
yum update
yum -y install htop
#创建基础目录
mkdir -p /data/config
mkdir -p /data/wwwroot
mkdir -p /data/mysql
mkdir -p /data/sh
mkdir -p /data/docker
mkdir -p /data/docker/nginx
mkdir -p /data/docker/mysql
mkdir -p /data/docker/redis
mkdir -p /data/docker/ssdb
mkdir -p /data/docker/php
#删除旧版本
yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
#安装 docker 依赖                  
yum -y install  yum-utils
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
#安装 docker    
yum -y install docker-ce docker-ce-cli containerd.io
service docker start
systemctl enable docker
#设置源
touch /etc/docker/daemon.json
echo '{"registry-mirrors": ["http://hub-mirror.c.163.com"]}' > /etc/docker/daemon.json

systemctl daemon-reload
service docker restart
#安装 nginx
cd /data/docker/nginx
docker run --name nginx \
		-d -p 80:80 \
		-v /data/wwwroot:/data/wwwroot \
		-d nginx
docker cp nginx:/etc/nginx/nginx.conf ./nginx.conf
docker cp nginx:/var/log/nginx .
docker cp nginx:/etc/nginx/conf.d .
docker stop nginx
docker rm nginx
docker run --name nginx \
		-d -p 80:80 \
		-v /data/wwwroot:/data/wwwroot \
		-v "$PWD"/nginx.conf:/etc/nginx/nginx.conf \
		-v "$PWD"/logs:/var/log/nginx \
		-v "$PWD"/conf.d:/etc/nginx/conf.d \
		-d nginx
#安装 mysql
cd /data/docker/mysql
docker run --name mysql \
		-p 3306:3306 \
		-e MYSQL_ROOT_PASSWORD=123456 \
		-d --privileged=true mysql 
docker cp mysql:/var/lib/mysql /data/mysql/data
docker stop mysql 
docker rm mysql 		
docker run --name mysql \
		-p 3306:3306 \
		-v /data/mysql/data:/var/lib/mysql \
		-e MYSQL_ROOT_PASSWORD=123456 \
		-d --privileged=true mysql
#安装 php
cd /data/docker/php
docker run --name php7.4 -d -p 9000:9000 -d php:7.4-fpm 
docker cp php7.4:/usr/local/etc/php-fpm.d/www.conf ./www.conf
docker cp php7.4:/usr/local/etc/php/php.ini-production ./php.ini
docker stop php7.4 
docker rm php7.4
docker run --name php7.4 \
	-d -p 9000:9000 \
	-v /data/wwwroot:/data/wwwroot \
	-v "$PWD"/www.conf:/usr/local/etc/php-fpm.d/www.conf \
	-v "$PWD"/php.ini:/usr/local/etc/php/php.ini \
	-d php:7.4-fpm 
