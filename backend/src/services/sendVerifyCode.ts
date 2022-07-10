import nodemailer from 'nodemailer';
import config from '../utils/configProvider';

const { smtp } = config;
const transporter = nodemailer.createTransport(smtp);

const sendVerifyCode = async (emailAdress: string, verifyCode: string) => {
  await transporter.sendMail({
    from: `"SDU Port Mapper" <${smtp.auth.user}>`, // sender address
    to: `${emailAdress}`, // list of receivers
    subject: 'SDU-Port-Mapper Verification Code', // Subject line
    html: `${emailAdress}正在注册山大端口映射管理网站的账号，您的验证码为：
    <code>${verifyCode}</code>
    该验证码十分钟内有效`, // plain text body
  });
};
export default sendVerifyCode;
