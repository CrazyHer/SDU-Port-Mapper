# 山东大学 校园网公网端口映射 (SDU Port Mapper)

Github: 

[https://github.com/CrazyHer/SDU-Port-Mapper](https://github.com/CrazyHer/SDU-Port-Mapper)

项目地址：

[https://sdu.herui.club](https://sdu.herui.club)

Docker Image:

[https://hub.docker.com/r/crazyher/sdu-port-mapper](https://hub.docker.com/r/crazyher/sdu-port-mapper)

鸣谢：

[@Hagb 的 docker-easyconnect 项目](https://github.com/Hagb/docker-easyconnect)

---

![前端界面截图-登录](image/README/1619667863914.png)

![前端界面截图-列表](image/README/1619667665299.png)

![前端界面截图-配置](image/README/1619667770345.png)

大致思路是将容器化的 easyconnect 部署在公网服务器上，通过 容器内 nginx 反向代理校内网端口实现公网映射的功能。因每次 ssh 上服务器手动增删映射配置较为麻烦，故开发为 web 前后端方便管理。最后将整体打包为 Docker image，方便部署。

---

## 部署使用

在 `~/.config/sdu-port-mapper/`下创建并填写 `config.json`配置文件（注意删除注释）:

```json
// backend/config.json
{
  "mysql": {
    //mysql数据库的配置项，用于存储用户信息和端口映射数据，数据库表结构在backend/MysqlSchema.sql中给出，使用mysql执行该文件即可自动创建初始化库表
    //如果要连接本机的mysql，则这里的hostname填docker eth的IP
    "hostname": "",
    "port": 3306,
    "username": "",
    "password": "",
    "database": "sdu_port_mapper"
  },
  "redis": {
    //redis数据库，用于存取token进行注册和登录信息验证
    "hostname": "",
    "port": 6379,
    "password": "",
    "db": 2
  },
  "smtp": {
    //smtp邮件服务器配置，用于发送邮件验证码完成注册
    "host": "",
    "port": 465,
    "secure": true,
    "auth": {
      "user": "",
      "pass": ""
    }
  }
}
```

执行以下命令直接启动应用

```bash
docker run --device /dev/net/tun --cap-add NET_ADMIN -ti \
        -p 8081:80 \
        -p 5999-6050:5999-6050 \
        -e EC_VER=7.6.3 \
        -e CLI_OPTS="-d vpnaddress -u username -p password" \
        -v $HOME/.config/sdu-port-mapper:/root \
        --name sdu-port-mapper \
        -d crazyher/sdu-port-mapper
```

参数解释：
`-p 8081:80`
管理平台前端页面端口，通过访问 http://本机 IP:8081 进入平台

`-p 5999-6050:5999-6050`
暴露容器内可供配置的端口

`-e CLI_OPTS="-d vpnaddress -u username -p password"`
vpnaddress 填 easyconnect 的 VPN 服务器地址，例如山大为 https://vpn.sdu.edu.cn , 后两项填账号密码

## 源码介绍

如果有修改的需要，可以参考此部分对源码进行修改并重新 build 打包构建 docker 镜像

### 前端部分

前端采用 react + antd 进行页面设计，使用 [rap2](http://rap2.taobao.org/) 进行接口管理和类型代码生成，若有接口修改需要，可以使用[rap 配置导出地址](http://rap2api.taobao.org/repository/get?id=282201)在 rap2 平台上创建自己的仓库并导入 (同时需要修改 package.json 中的 rapper 脚本) ，也可以在 frontend/rapper/中进行自定义修改，还可以直接放弃 rap2，手写类型和请求代码。

请求 URL 前缀在 frontend/src/constants/fetch.ts 中自定义：

```ts
// frontend/constants/fetch.ts
export const FETCH_ROOT_URL = '/api';
```

注册时在 frontend/src/components/layout.tsx 中有表单验证：邮箱只限山大邮箱。如需修改可将对应的 <From.Item> 部分的 rules 校验规则修改即可。

以下命令以 frontend/ 为工作目录：

安装 npm 包：`yarn`

调试模式启动：`yarn start`

生产模式打包：`yarn build`

使用 rap 更新接口数据：`yarn rapper`

### 后端部分

后端框架采用 koa2，同时配置了 webpack 实现打包为单文件，方便服务器直接部署。

以下命令以 backend/ 为工作目录：

首先安装 npm 包：`yarn`

直接启动：`yarn start`

调试模式启动 (文件更新时自动重启后端)：`yarn dev`

打包为单文件：`yarn build`

更新 rap 接口定义：`yarn rapper`

### Docker 部分

对前后端打包后分别将 build 移至 `docker/`下，执行 `docker build`进行构建：

```bash
cd backend
yarn && yarn build
cp -r build ../docker/backend-build

cd ../frontend
yarn && yarn build
cp -r build ../docker/frontend-build

cd ../docker
docker build --pull -t xxx/sdu-port-mapper .

```
