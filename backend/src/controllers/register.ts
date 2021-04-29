import { Context } from 'koa';
import { Models } from '../rapper';
import getUserAvailableCount from '../services/getUserAvailableCount';
import mysql from '../utils/mysql';
import redis from '../utils/redis';

export default async (ctx: Context) => {
  try {
    const { email, password, verifycode } = ctx.request
      .body as Models['POST/register']['Req'];
    if (await getUserAvailableCount(email)) {
      ctx.body = {
        code: -1,
        message: '用户已存在',
      } as Models['POST/register']['Res'];
      return;
    }
    if (verifycode !== (await redis.get(email))) {
      ctx.body = {
        code: -1,
        message: '验证码不正确',
      } as Models['POST/register']['Res'];
      return;
    }
    // 新用户只能配置3个端口
    await mysql.execute(
      'INSERT INTO `sduproxy`.`user` (`mail`, `password`, `remains`) VALUES (?, ?, ?);',
      [email, password, 3]
    );
    ctx.body = {
      code: 0,
      message: 'success',
    } as Models['POST/register']['Res'];
  } catch (error) {
    ctx.body = {
      code: -1,
      message: String(error),
    } as Models['POST/register']['Res'];
  }
};
