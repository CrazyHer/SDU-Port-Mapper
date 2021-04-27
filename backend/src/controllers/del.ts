import { Context } from 'koa';
import { Models } from '../rapper';
import authToken from '../services/authToken';
import delProxy from '../services/delProxy';
import getProxy from '../services/getProxy';

export default async (ctx: Context) => {
  try {
    const user = await authToken(ctx.request.header.token as any);
    if (user) {
      const { outerPort } = ctx.body as Models['POST/del']['Req'];
      // 用户只能删除自己创建的配置
      if (user === (await getProxy(outerPort))?.creator) {
        await delProxy(outerPort);
        ctx.body = { code: 0, message: 'success' } as Models['POST/del']['Res'];
      } else {
        ctx.body = { code: -1, message: '无权限' } as Models['POST/del']['Res'];
      }
    } else {
      ctx.body = {
        code: -1,
        message: '登录信息无效或过期',
      } as Models['POST/del']['Res'];
    }
  } catch (error) {
    console.error('del请求失败：', error);
    ctx.body = {
      code: -1,
      message: String(error),
    } as Models['POST/del']['Res'];
  }
};
