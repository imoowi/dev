# Go gin框架

## gin 安装 (https://github.com/gin-gonic/gin)

- The first need Go installed (version 1.12+ is required), then you can use the below Go command to install Gin.
	
	```
	$ go get -u github.com/gin-gonic/gin
	```

- Import it in your code:

	```
	import "github.com/gin-gonic/gin"

	```

- Example:

	```
	package main

	import "github.com/gin-gonic/gin"

	func main() {
		r := gin.Default()
		r.GET("/ping", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "pong",
			})
		})
		r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
	}
	```

## gin-swaggar 安装

- 下载安装 swag

	```
	$ go get -u github.com/swaggo/swag/cmd/swag
	
	```

- 在Go项目根文件夹中运行Swag
	
	```
	$ swag init //在main.go所在目录执行
	
	```

- 下载gin-swagger
	```
	$ go get -u github.com/swaggo/gin-swagger
	$ go get -u github.com/swaggo/files
	```
- 在路由文件引入
	```
	import (
		"github.com/gin-gonic/gin"
		swaggerFiles "github.com/swaggo/files"
		ginSwagger "github.com/swaggo/gin-swagger"
	)

	```
- 添加访问文档路由
	```
	// swage 文档访问路由\n
	eng := gin.Default()
	eng.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	```	

- 访问 url
	```
	http://host:port/swagger/index.html

	```

- 注释参数

	- 参考地址：
		https://swaggo.github.io/swaggo.io/declarative_comments_format/general_api_info.html

	- 主程序注释(main.go)
```
// @title 整个项目的名称
// @version 1.0 
// @description  Golang api of demo
// @termsOfService http://github.com/imoowi

// @contact.name yuanjun
// @contact.url http://simple.imoowi.com
// @contact.email imoowi@qq.com

//@host 127.0.0.1:8007
func main() {
}

```
	- 控制器注释（controller.go）

		- Get 参数方法
```
type GetOperationLogListResponse struct {
    List  *[]model.OperationLog `json:"list"`
    Total int                   `json:"total"`
}

// @Title 应用中心操作日志
// @Author simpleyuan@gmail.com
// @Description 获取应用中心操作日志
// @Tags operationlog
// @Param Authorization	header string true "Bearer 31a165baebe6dec616b1f8f3207b4273"
// @Param route formData string false "路由"
// @Param operator formData string false "操作者"
// @Param operation_type formData string false "操作类型 1 新增、2 删除、3 更新"
// @Param description formData string false "操作描述"
// @Param start_time formData string false "开始时间"
// @Param end_time formData string false "结束时间"
// @Param page formData string true "页数"
// @Param size formData string true "数据条数"
// @Success 200 {object} GetOperationLogListResponse
// @Router	/api/v1/app/operationlog/appcenter [get]
func GetOperationLogList(c *gin.Context) {
    
}

```	
	
		- Post 参数方法
```
ReleaseTemplateAdd struct {
    Name               string `json:"name"`
    DeployEnv          string `json:"deploy_env"`
    GitlabType         int    `json:"gitlab_type"`
    GitlabBranchName   string `json:"gitlab_branch_name"`
    IsAutoRelease      int    `json:"is_auto_release"`
    Description        string `json:"description"`
    GitlabCITemplateID int32  `json:"gitlab_ci_template_id"`
    GitlabID           uint32 `json:"gitlab_id"`
}
// @Title 新增模版
// @Author simpleyuan@gmail.com
// @Description 新增模版
// @Tags release template
// @Param Authorization	header	string true "Bearer 31a165baebe6dec616b1f8f3207b4273"
// @Param body body	ReleaseTemplateAdd true "JSON数据"
// @Success 200 {object} handler.ReportJSONResult
// @Router	/api/v1/release/template/add [post]
func ReleaseTemplateAdd(c *gin.Context){
    
}

```		