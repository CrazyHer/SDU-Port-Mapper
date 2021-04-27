import { Context } from 'koa';
import { Models } from '../rapper';
import authLogin from '../services/authLogin';
import redis from '../utils/redis';

export default async (ctx: Context) => {
  const { email, password } = ctx.request.body as Models['POST/login']['Req'];
  if (await authLogin(email, password)) {
    // 生成22位左右的随机token
    const token = `${Math.random()
      .toString(36)
      .substr(2)}${Math.random()
      .toString(36)
      .substr(2)}`;
    // redis设置token与email的一一映射
    redis
      .pipeline()
      .setex(email, 86400, token)
      .setex(token, 86400, email);
    ctx.body = {
      code: 0,
      data: { token: token },
      message: 'success',
    } as Models['POST/login']['Res'];
  } else {
    ctx.body = {
      code: -1,
      data: {},
      message: '账号或密码错误！',
    } as Models['POST/login']['Res'];
  }
};
