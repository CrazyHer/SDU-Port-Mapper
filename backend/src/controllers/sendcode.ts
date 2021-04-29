import { Context } from 'koa';
import { Models } from '../rapper';
import getUserAvailableCount from '../services/getUserAvailableCount';
import sendVerifyCode from '../services/sendVerifyCode';
import redis from '../utils/redis';

export default async (ctx: Context) => {
  try {
    const { email } = ctx.request.body as Models['POST/sendcode']['Req'];
    if (await getUserAvailableCount(email)) {
      ctx.body = {
        code: -1,
        message: '用户已存在',
      } as Models['POST/sendcode']['Res'];
      return;
    }
    // 随机生成10位左右的验证码
    const code = `${Math.random()
      .toString(36)
      .substr(2)}`;
    await sendVerifyCode(email, code);
    await redis.setex(email, 600, code);
    ctx.body = {
      code: 0,
      message: 'success',
    } as Models['POST/sendcode']['Res'];
  } catch (error) {
    ctx.body = {
      code: -1,
      message: String(error),
    } as Models['POST/sendcode']['Res'];
  }
};
