import child from 'child_process';
import fs from 'fs';
import path from 'path';
import mysql from '../utils/mysql';
import getProxy from './getProxy';

const delProxy = (
  outerPort: number,
  type: 'http' | 'stream',
  creator: string
) =>
  new Promise<void>((resolve, reject) => {
    mysql
      .execute('DELETE FROM `sduproxy`.`proxylist` WHERE (`outerPort` = ?);', [
        outerPort,
      ])
      .then(() => {
        fs.rmSync(
          path.join('/root', '.config/easyconnect', type, `${outerPort}`)
        );
        const ps = child.exec(
          'docker exec -i easyconnect nginx -s reload',
          (err, stdout, stderr) => {
            if (err || stderr) {
              console.error(err, stderr);
              reject(err || stderr);
            }
          }
        );
        ps.on('error', reject);
        ps.on('exit', async (code, sig) => {
          if (code === 0) {
            await mysql.execute(
              'UPDATE `sduproxy`.`user` SET remains = remains+1 WHERE (`mail` = ?);',
              [creator]
            );
            resolve();
          } else reject('nginx配置异常');
        });
      })
      .catch(reject);
  });

export default delProxy;
