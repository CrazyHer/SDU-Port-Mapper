import child from 'child_process';
import fs from 'fs';
import path from 'path';
import mysql from '../utils/mysql';

const delProxy = (
  outerPort: number,
  type: 'http' | 'stream',
  creator: string
) =>
  new Promise<void>((resolve, reject) => {
    mysql
      .execute('DELETE FROM `proxylist` WHERE (`outerPort` = ?);', [outerPort])
      .then(() => {
        fs.rmSync(path.join('/etc/nginx', type, `${outerPort}`));
        const ps = child.exec('nginx -s reload', (err, stdout, stderr) => {
          if (err || stderr) {
            console.error(err, stderr);
            reject(err || stderr);
          }
        });
        ps.on('error', reject);
        ps.on('exit', async (code, sig) => {
          if (code === 0) {
            await mysql.execute(
              'UPDATE `user` SET remains = remains+1 WHERE (`mail` = ?);',
              [creator]
            );
            resolve();
          } else reject('nginx配置异常');
        });
      })
      .catch(reject);
  });

export default delProxy;
