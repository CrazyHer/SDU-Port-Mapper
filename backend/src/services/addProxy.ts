import fs = require('fs/promises');
import child = require('child_process');
import path = require('path');
import mysql from '../utils/mysql';

const addProxy = (
  outerPort: number,
  type: 'http' | 'stream',
  proxy_pass: string,
  otherOptions: string,
  comment: string,
  creator: string
) =>
  new Promise<void>((resolve, reject) => {
    if (type === 'http') {
      const config = `server {
  listen ${outerPort};
  server_name sdu.herui.club;
  location / {
    ${otherOptions}
    proxy_pass  ${proxy_pass};
  }
}`;
      fs.writeFile(
        path.resolve('~', '.config/easyconnect/http', `${outerPort}`),
        config
      )
        .then(() => {
          // 让nginx载入新配置
          const ps = child.exec('docker exec -it easyconnect nginx -s reload');
          ps.on('error', (err) => {
            fs.rm(
              path.resolve('~', '.config/easyconnect/http', `${outerPort}`)
            );
            reject(err.message);
          });
          ps.on('exit', (code, sig) => {
            if (code === 0) {
              mysql
                .execute(
                  'INSERT INTO `sduproxy`.`proxylist` (`outerPort`, `innerAdress`, `type`, `comment`, `creator`, `otherOptions`) VALUES (?, ?, ?, ?, ?, ?)',
                  [outerPort, proxy_pass, type, comment, creator, otherOptions]
                )
                .then(() => resolve());
            } else {
              fs.rm(
                path.resolve('~', '.config/easyconnect/http', `${outerPort}`)
              );
              reject('nginx配置异常');
            }
          });
        })
        .catch((err) => {
          reject(err);
        });
    } else if (type === 'stream') {
      const config = `stream {
        server {
                listen ${outerPort};
                proxy_pass ${proxy_pass};
                ${otherOptions}
        }
}`;
      fs.writeFile(
        path.resolve('~', '.config/easyconnect/stream', `${outerPort}`),
        config
      )
        .then(() => {
          // 让nginx载入新配置
          const ps = child.exec('docker exec -it easyconnect nginx -s reload');
          ps.on('error', (err) => {
            fs.rm(
              path.resolve('~', '.config/easyconnect/stream', `${outerPort}`)
            );
            reject(err.message);
          });
          ps.on('exit', (code, sig) => {
            if (code === 0) {
              mysql
                .execute(
                  'INSERT INTO `sduproxy`.`proxylist` (`outerPort`, `innerAdress`, `type`, `comment`, `creator`, `otherOptions`) VALUES (?, ?, ?, ?, ?, ?)',
                  [outerPort, proxy_pass, type, comment, creator, otherOptions]
                )
                .then(() => resolve());
            } else {
              fs.rm(
                path.resolve('~', '.config/easyconnect/http', `${outerPort}`)
              );
              reject('nginx配置异常');
            }
          });
        })
        .catch((err) => {
          reject(err);
        });
    } else reject();
  });

export default addProxy;
