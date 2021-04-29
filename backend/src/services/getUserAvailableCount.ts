import mysql from '../utils/mysql';

const getUserAvailableCount = async (
  userEmail: string
): Promise<number | undefined | null> => {
  const [
    rows,
  ]: any = await mysql.execute('select remains from user where mail = ?', [
    userEmail,
  ]);
  if (rows[0]) return rows[0].remains;
  return null;
};

export default getUserAvailableCount;
