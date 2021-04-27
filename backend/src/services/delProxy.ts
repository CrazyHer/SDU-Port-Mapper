import child from 'child_process';
import fs from 'fs';
import path from 'path';
import mysql from '../utils/mysql';

const delProxy = (outerPort: number) =>
  new Promise<void>((resolve, reject) => {
    mysql
      .execute('DELETE FROM `sduproxy`.`proxylist` WHERE (`outerPort` = ?);', [
        outerPort,
      ])
      .then(() => {
        fs.rmSync(
          path.resolve('~', '.config/easyconnect/http', `${outerPort}`)
        );
        const ps = child.exec('docker exec -it nginx -s reload');
        ps.on('error', reject);
        ps.on('exit', (code, sig) => {
          if (code === 0) {
            resolve();
          } else reject('nginx配置异常');
        });
      })
      .catch((err) => reject);
  });

export default delProxy;
