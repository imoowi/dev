# yii2.0命令
- 参考地址 https://www.yiichina.com/doc/guide/2.0/start-installation
- 创建项目
	- 基础版
```
composer create-project --prefer-dist --stability=dev yiisoft/yii2-app-basic projectName
```
	- 高级版
```
composer create-project --prefer-dist --stability=dev yiisoft/yii2-app-advanced projectName
```

- 初始化
```
cd prejectName
./init
```
```
Yii Application Initialization Tool v1.0

Which environment do you want the application to be initialized in?

  [0] Development
  [1] Production

  Your choice [0-1, or "q" to quit] 0

  Initialize the application under 'Development' environment? [yes|no] yes

  Start initialization ...

   generate frontend/config/test-local.php
   generate frontend/config/params-local.php
   generate frontend/config/main-local.php
   generate frontend/config/codeception-local.php
   generate frontend/web/index.php
   generate frontend/web/robots.txt
   generate frontend/web/index-test.php
   generate yii
   generate backend/config/test-local.php
   generate backend/config/params-local.php
   generate backend/config/main-local.php
   generate backend/config/codeception-local.php
   generate backend/web/index.php
   generate backend/web/robots.txt
   generate backend/web/index-test.php
   generate common/config/test-local.php
   generate common/config/params-local.php
   generate common/config/main-local.php
   generate common/config/codeception-local.php
   generate yii_test.bat
   generate yii_test
   generate console/config/test-local.php
   generate console/config/params-local.php
   generate console/config/main-local.php
   generate cookie validation key in backend/config/main-local.php
   generate cookie validation key in common/config/codeception-local.php
   generate cookie validation key in frontend/config/main-local.php
      chmod 0777 backend/runtime
      chmod 0777 backend/web/assets
      chmod 0777 console/runtime
      chmod 0777 frontend/runtime
      chmod 0777 frontend/web/assets
      chmod 0755 yii
      chmod 0755 yii_test

  ... initialization completed.
```
