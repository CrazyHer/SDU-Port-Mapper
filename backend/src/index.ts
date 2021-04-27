import Koa = require('koa');
import cors = require('koa2-cors');
import koabody = require('koa-body');

import route from './controllers/router';
import config = require('../config.json');
import mysql from './utils/mysql';
import redis from './utils/redis';

const app = async () => {
  const koa = new Koa();
  koa.use(cors());
  koa.use(koabody());

  koa.use(route.routes()).use(route.allowedMethods());
  // 测试mysql连接
  await mysql
    .getConnection()
    .then((res) => {
      console.log('Mysql服务器已连接');
      res.release();
    })
    .catch((err) => {
      console.error('Mysql服务器连接失败', err);
      process.exit(-1);
    });
  // 测试redis连接,连接失败并重试尝试10次后redis将抛出异常终止服务器
  await redis
    .setex('test', 1, 'test')
    .then((suc) => {
      console.log('Redis服务器已连接');
    })
    .catch((err) => {
      console.error('Redis服务器连接失败', err);
      process.exit(-1);
    });

  koa.listen(config.port);
  console.log(`服务器已启动在${config.port}端口`);
};

app().catch((err) => {
  console.error('服务器出错了!', err);
});
