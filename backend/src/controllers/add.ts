import { Context } from 'koa';
import { Models } from '../rapper';
import addProxy from '../services/addProxy';
import authToken from '../services/authToken';
import getUserAvailableCount from '../services/getUserAvailableCount';

export default async (ctx: Context) => {
  try {
    const user = await authToken(ctx.request.header.token as any);
    if (user && ((await getUserAvailableCount(user)) as number) > 0) {
      const {
        type,
        data: { proxyPass, optherOptions },
        outerPort,
        comment,
      } = ctx.request.body as Models['POST/add']['Req'];
      await addProxy(
        outerPort,
        type as 'http' | 'stream',
        proxyPass,
        optherOptions,
        comment,
        user
      );
      ctx.body = {
        code: 0,
        message: 'success',
      } as Models['POST/add']['Res'];
    } else if (user) {
      ctx.body = {
        code: -1,
        message: '用户已配置端口数量达到上限',
      } as Models['POST/add']['Res'];
    } else {
      ctx.body = {
        code: -1,
        message: '登录信息无效或过期',
      } as Models['POST/add']['Res'];
    }
  } catch (error) {
    console.error('add请求失败：', error);
    ctx.body = {
      code: -1,
      message: String(error),
    } as Models['POST/add']['Res'];
  }
};
