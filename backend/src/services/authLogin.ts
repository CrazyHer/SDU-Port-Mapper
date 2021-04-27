import mysql from '../utils/mysql';

const authLogin = async (email: string, password: string): Promise<boolean> => {
  const [
    rows,
  ]: any = await mysql.execute('select password from user where mail = ?', [
    email,
  ]);
  if (rows[0]?.password === password) {
    return true;
  }
  return false;
};
export default authLogin;
