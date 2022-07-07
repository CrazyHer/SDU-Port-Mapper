/**
 * 从环境变量中获取config
 */
const getConfig = (): {
  port: number;
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
  return {
    port: 2333,
    mysql: {
      hostname: '',
      port: 3306,
      username: '',
      password: '',
      database: '',
    },
    redis: {
      hostname: '',
      port: 6379,
      password: '',
    },
    smtp: {
      host: '',
      port: 465,
      secure: true,
      auth: {
        user: '',
        pass: '',
      },
    },
  };
};

export default getConfig();
