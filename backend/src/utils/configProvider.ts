import fs from 'fs-extra';
import path from 'path';
/**
 * 1. 优先使用同目录下的配置文件config.json
 * 2. 若无，则读取JSON格式的环境变量env.sdu_port_mapper_config
 * 3. 都没有，则抛出异常，退出程序
 */
const getConfig = (): {
  mysql: {
    hostname: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
  redis: {
    hostname: string;
    port: number;
    password: string;
    db: number;
  };
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
} => {
  const configFile = path.join(__dirname, 'config.json');

  if (fs.existsSync(configFile)) {
    return fs.readJsonSync(configFile);
  } else if (process.env.sdu_port_mapper_config) {
    return JSON.parse(process.env.sdu_port_mapper_config);
  }

  throw new Error('没有检测到配置文件! ');
};

export default getConfig();
