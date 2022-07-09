import * as db from 'mysql2/promise';
import config from '../utils/configProvider';

const { hostname, username, password, port, database } = config.mysql;
const mysql = db.createPool({
  host: hostname,
  port,
  user: username,
  password,
  database,
});

export default mysql;
