import fs = require('fs/promises');
import child = require('child_process');
import path = require('path');
import mysql from '../utils/mysql';
import getProxy from './getProxy';

const addProxy = (
  outerPort: number,
  type: 'http' | 'stream',
  proxy_pass: string,
  otherOptions: string,
  comment: string,
  creator: string
) =>
  new Promise<void>((resolve, reject) => {
    getProxy(outerPort).then((res) => {
      if (res) reject('端口已被占用!');

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
          path.join('/root', '.config/easyconnect/http', `${outerPort}`),
          config
        )
          .then(() => {
            // 让nginx载入新配置
            const ps = child.exec(
              'docker exec -i easyconnect nginx -s reload',
              (err, stdout, stderr) => {
                if (err || stderr) {
                  console.error(err, stderr);
                  reject(err || stderr);
                }
              }
            );
            ps.on('error', (err) => {
              fs.rm(
                path.join('/root', '.config/easyconnect/http', `${outerPort}`)
              );
              reject(err.message);
            });
            ps.on('exit', (code, sig) => {
              if (code === 0) {
                mysql
                  .execute(
                    'INSERT INTO `sduproxy`.`proxylist` (`outerPort`, `innerAdress`, `type`, `comment`, `creator`, `otherOptions`) VALUES (?, ?, ?, ?, ?, ?)',
                    [
                      outerPort,
                      proxy_pass,
                      type,
                      comment,
                      creator,
                      otherOptions,
                    ]
                  )
                  .then(() =>
                    mysql.execute(
                      'UPDATE `sduproxy`.`user` SET remains = remains-1 WHERE (`mail` = ?);',
                      [creator]
                    )
                  )
                  .then(() => resolve())
                  .catch(reject);
              } else {
                fs.rm(
                  path.join('/root', '.config/easyconnect/http', `${outerPort}`)
                );
                reject('nginx配置异常');
              }
            });
          })
          .catch((err) => {
            reject(err);
          });
      } else if (type === 'stream') {
        const config = `server {
                  listen ${outerPort};
                  proxy_pass ${proxy_pass};
                  ${otherOptions}
          }`;
        fs.writeFile(
          path.join('/root', '.config/easyconnect/stream', `${outerPort}`),
          config
        )
          .then(() => {
            // 让nginx载入新配置
            const ps = child.exec(
              'docker exec -i easyconnect nginx -s reload',
              (err, stdout, stderr) => {
                if (err || stderr) {
                  console.error(err, stderr);
                  reject(err || stderr);
                }
              }
            );
            ps.on('error', (err) => {
              fs.rm(
                path.join('/root', '.config/easyconnect/stream', `${outerPort}`)
              );
              reject(err.message);
            });
            ps.on('exit', (code, sig) => {
              if (code === 0) {
                mysql
                  .execute(
                    'INSERT INTO `sduproxy`.`proxylist` (`outerPort`, `innerAdress`, `type`, `comment`, `creator`, `otherOptions`) VALUES (?, ?, ?, ?, ?, ?)',
                    [
                      outerPort,
                      proxy_pass,
                      type,
                      comment,
                      creator,
                      otherOptions,
                    ]
                  )
                  .then(() =>
                    mysql.execute(
                      'UPDATE `sduproxy`.`user` SET remains = remains-1 WHERE (`mail` = ?);',
                      [creator]
                    )
                  )
                  .then(() => resolve())
                  .catch(reject);
              } else {
                fs.rm(
                  path.join(
                    '/root',
                    '.config/easyconnect/stream',
                    `${outerPort}`
                  )
                );
                reject('nginx配置异常,注意stream类型必须带上端口');
              }
            });
          })
          .catch((err) => {
            reject(err);
          });
      } else reject();
    });
  });

export default addProxy;
