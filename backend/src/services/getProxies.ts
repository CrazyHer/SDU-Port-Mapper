import { Models } from '../rapper';
import mysql from '../utils/mysql';

const getProxies = async (): Promise<Models['GET/getlist']['Res']['data']> => {
  const [rows]: any = await mysql.execute('SELECT * FROM proxylist;');
  const data: Models['GET/getlist']['Res']['data'] = [];
  for (let i = 0; i < rows.length; i++) {
    data.push({
      outerPort: rows[i].outerPort,
      innerAdress: rows[i].innerAdress,
      type: rows[i].type,
      comment: rows[i].comment,
      creator: rows[i].creator,
      otherOptions: rows[i].otherOptions,
    });
  }
  return data;
};
export default getProxies;
