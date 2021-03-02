# 架构师-千万粉丝，微博feed业务，架构与细节
- feed类业务，特点+关键动作+核心元数据
	![](https://raw.githubusercontent.com/imoowi/dev/main/%E6%9E%B6%E6%9E%84%E5%B8%88%E7%AC%94%E8%AE%B0/img/149.png)
- 最大的难点
	- 我们的主页，是由别人发布的 feed 组成的
- 获取方式
	- 拉取（读扩散）
	- 推送（写扩散）
- 核心数据结构：关注关系+粉丝关系+发布的 feed 消息
	![](https://raw.githubusercontent.com/imoowi/dev/main/%E6%9E%B6%E6%9E%84%E5%B8%88%E7%AC%94%E8%AE%B0/img/150.png)

- 核心流程
	- 发布 feed
		![](https://raw.githubusercontent.com/imoowi/dev/main/%E6%9E%B6%E6%9E%84%E5%B8%88%E7%AC%94%E8%AE%B0/img/151.png)
	- 取消关注
		![](https://raw.githubusercontent.com/imoowi/dev/main/%E6%9E%B6%E6%9E%84%E5%B8%88%E7%AC%94%E8%AE%B0/img/152.png)
	- 拉取 feed 页
		![](https://raw.githubusercontent.com/imoowi/dev/main/%E6%9E%B6%E6%9E%84%E5%B8%88%E7%AC%94%E8%AE%B0/img/153.png)
- 读扩散的优缺点
	![](https://raw.githubusercontent.com/imoowi/dev/main/%E6%9E%B6%E6%9E%84%E5%B8%88%E7%AC%94%E8%AE%B0/img/154.png)
- 写扩散：被逼发展而来的模式
	- 核心数据结构：收到的 feed 消息（新增）
		![](https://raw.githubusercontent.com/imoowi/dev/main/%E6%9E%B6%E6%9E%84%E5%B8%88%E7%AC%94%E8%AE%B0/img/155.png)
	- 拉取 feed 页
		![](https://raw.githubusercontent.com/imoowi/dev/main/%E6%9E%B6%E6%9E%84%E5%B8%88%E7%AC%94%E8%AE%B0/img/156.png)
- feed 业务总结
	![](https://raw.githubusercontent.com/imoowi/dev/main/%E6%9E%B6%E6%9E%84%E5%B8%88%E7%AC%94%E8%AE%B0/img/157.png)