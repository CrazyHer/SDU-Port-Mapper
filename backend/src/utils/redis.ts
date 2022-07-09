import Redis from 'ioredis';
import config from '../utils/configProvider';

const { hostname, password, port, db } = config.redis;
const redis = new Redis({
  host: hostname,
  password,
  port,
  maxRetriesPerRequest: 5,
  db,
});

export default redis;
