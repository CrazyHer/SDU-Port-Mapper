import nodemailer from 'nodemailer';
import { smtp } from '../../config.json';
const sendVerifyCode = async (emailAdress: string, verifyCode: string) => {
  let transporter = nodemailer.createTransport(smtp);
  await transporter.sendMail({
    from: '"HeRui" <877955100@qq.com>', // sender address
    to: `${emailAdress}`, // list of receivers
    subject: 'SDU-Port-Mapping-Verify-Code', // Subject line
    html: `${emailAdress}正在注册山大端口映射管理网站的账号，您的验证码为：
    <code>${verifyCode}</code>
    该验证码十分钟内有效`, // plain text body
  });
};
export default sendVerifyCode;
