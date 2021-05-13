# docker操作常用命令
- 拉取镜像
```
$ docker pull imoowi/php7.4:v2

```
- 运行容器
```
$ docker run --name php7.4 -d -p 9000:9000 -d imoowi/php7.4:v2
$ docker cp php7.4:/usr/local/etc/php-fpm.d/www.conf ./www.conf
$ docker cp php7.4:/usr/local/etc/php/php.ini-production ./php.ini
$ docker stop php7.4 
$ docker rm php7.4
$ docker run --name php7.4 \
    -d -p 9000:9000 \
    -v /data/wwwroot:/data/wwwroot \
    -v "$PWD"/www.conf:/usr/local/etc/php-fpm.d/www.conf \
    -v "$PWD"/php.ini:/usr/local/etc/php/php.ini \
    -d imoowi/php7.4:v2

```
- 打包
```
//docker commit -a "作者名" -m "提交信息" [你的容器ID] [容器名]
$ docker commit -a "imoowi" -m "增加了protobuf支持" 17e8d245cf57 imoowi/php7.4
$ docker images | grep php
//docker tag [镜像ID或镜像名] [dockerhub的仓库名]
$ docker tag 1ccb168e6a0d imoowi/php7.4:v3
$ docker push imoowi/php7.4:v3

```
- 查看 
	https://hub.docker.com/repository/docker/imoowi/php7.4

### Nginx+PHP+Redis+Memcached+Mysql5.6+ssdb 
- Nginx
	https://hub.docker.com/repository/docker/imoowi/nginx
- PHP7.4
	https://hub.docker.com/repository/docker/imoowi/php7.4
- Redis
	https://hub.docker.com/repository/docker/imoowi/redis
- Memcached
	https://hub.docker.com/repository/docker/imoowi/memcached
- Mysql5.6
	https://hub.docker.com/repository/docker/imoowi/mysql5.6
- ssdb
	https://hub.docker.com/repository/docker/imoowi/ssdb

### docker-compose 形式运行服务
```
cd lnmp
```
- 启动服务
```

docker-compose up -d
```
- 停止服务
```
docker-compose down
```

- 重启服务
```
docker-compose restart
```