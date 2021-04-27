import mysql from '../utils/mysql';

const getProxy = async (
  outerPort: number
): Promise<{
  outerPort: number;
  innerAdress: string;
  type: string;
  comment: string;
  creator: string;
  otherOptions: string;
} | null> => {
  const [
    rows,
  ]: any = await mysql.execute(
    'SELECT * FROM sduproxy.proxylist where outerPort = ?;',
    [outerPort]
  );
  if (rows[0]) {
    return {
      outerPort: rows[0].outerPort,
      innerAdress: rows[0].innerAdress,
      type: rows[0].type,
      comment: rows[0].comment,
      creator: rows[0].creator,
      otherOptions: rows[0].otherOptions,
    };
  } else return null;
};
export default getProxy;
