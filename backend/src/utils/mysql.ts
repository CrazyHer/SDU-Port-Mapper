import * as db from 'mysql2/promise';
import config = require('../../config.json');

const { hostname, username, password, port, database } = config.mysql;
const mysql = db.createPool({
  host: hostname,
  port: port,
  user: username,
  password: password,
  database: database,
});

export default mysql;
