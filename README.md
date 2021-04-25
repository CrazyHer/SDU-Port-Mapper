# SDU 校内端口映射管理平台 (SDU Port Mapping)

项目地址：

[http://sdu.herui.club](http://sdu.herui.club)

鸣谢：

[@Hagb 的 docker-easyconnect 项目](https://github.com/Hagb/docker-easyconnect)

---

具体思路是将容器化的 easyconnect 部署在个人的腾讯云服务器上，通过 nginx 反向代理校内网端口实现公网映射的功能。因每次 ssh 上服务器手动增删映射配置较为麻烦，故开发为 web 前后端方便管理。

前端采用 react + antd 进行页面设计

后端采用 koa2

---

## 后端接口文档：

**_本文档由 Rap2 (https://github.com/thx/rap2-delos) 生成_**

**_生成日期：2021-04-24 12:43:23_**

### 接口：login

- 地址：/login
- 类型：POST
- 状态码：200
- 简介：登录
- 请求接口格式：

```
├─ email: String (必选)
└─ password: String (必选)

```

- 返回接口格式：

```
├─ code: Number (必选)
├─ message: String (必选)
└─ data: Object
   └─ token: String (必选)

```

### 接口：getlist

- 地址：/getlist
- 类型：GET
- 状态码：200
- 简介：获取所有端口映射数据
- 请求接口格式：

```

```

- 返回接口格式：

```
├─ data: Array
│  └─ outerPort: Number (必选)
├─ code: Number (必选)
└─ message: String (必选)

```

### 接口：add

- 地址：/add
- 类型：POST
- 状态码：200
- 简介：添加一条映射配置
- 请求接口格式：

```
├─ outerPort: Number (必选)
├─ type: String (必选) (stream或http)
└─ data: Object
   ├─ port: Number  (type为stream时填写)
   └─ proxyset: String  (type为http时填写，为nginx http配置中 location / {  } 内的部分)

```

- 返回接口格式：

```
├─ code: Number (必选)
└─ message: String (必选)

```

### 接口：del

- 地址：/del
- 类型：POST
- 状态码：200
- 简介：删除一条映射配置
- 请求接口格式：

```
└─ outerPort: Number (必选) (外部端口号)

```

- 返回接口格式：

```
├─ code: Number (必选)
└─ message: String (必选)

```

### 接口：register

- 地址：/register
- 类型：POST
- 状态码：200
- 简介：注册账号
- 请求接口格式：

```
├─ email: String (必选) (必须为山大邮箱)
├─ password: String (必选)
└─ verifycode: String (必选) (发送到邮箱的验证码)

```

- 返回接口格式：

```
├─ code: Number (必选)
└─ message: String (必选)

```
