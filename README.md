# 模拟http接口服务器


> 注意：

> 目前新增的接口，只用json文件进行存储。

> 如若是大量用户使用，请自行切到db存储方式。


<br>

nginx配置：
```
# apitester
location /apitester/api {
    # 反向代理到 8001 端口
    proxy_pass http://127.0.0.1:8001;
}
```

<br>

启动NODEJS服务器进程：
```
node app.js
```