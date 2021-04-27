import Redis = require('ioredis');
import config = require('../../config.json');
const { hostname, password, port } = config.redis;
const redis = new Redis({
  host: hostname,
  password: password,
  port: port,
  maxRetriesPerRequest: 10,
});

export default redis;
