import { Context } from 'koa';
import { Models } from '../rapper';
import authToken from '../services/authToken';
import getProxies from '../services/getProxies';

export default async (ctx: Context) => {
  try {
    const user = await authToken(ctx.request.header.token as any);
    if (user) {
      ctx.body = {
        code: 0,
        message: 'success',
        data: await getProxies(),
      } as Models['GET/getlist']['Res'];
    } else {
      ctx.body = {
        code: -1,
        message: '登录信息无效或过期',
        data: [],
      } as Models['GET/getlist']['Res'];
    }
  } catch (error) {
    console.error('getlist请求失败：', error);
    ctx.body = {
      code: -1,
      message: String(error),
    } as Models['GET/getlist']['Res'];
  }
};
