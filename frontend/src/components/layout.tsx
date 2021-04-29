import {
  Layout,
  Button,
  message,
  Form,
  Input,
  Modal,
  Checkbox,
  Col,
  Row,
} from 'antd';
import { inject, observer } from 'mobx-react';
import React, { useState } from 'react';
import sha256 from 'crypto-js/hmac-sha256';
import User from '../store/user';
import { fetch, Models } from '../rapper';
import './layout.css';

const HLayout = (props: any) => {
  const user = props.user as User;
  const [loading, setLoading] = useState<boolean>(false);
  const [loginModalVisible, setLoginModalVisible] = useState<boolean>(false);
  const [registerModalVisible, setRegisterModalVisible] = useState<boolean>(
    false
  );
  const [hasSent, setHasSent] = useState<boolean>(false);
  const [registerForm] = Form.useForm();
  const handleLogin = async (e: {
    email: string;
    password: string;
    autologin: boolean;
  }) => {
    try {
      setLoading(true);
      e.password = sha256('CrazyHer', e.password).toString();
      const res = await fetch['POST/login'](e);
      if (res.code === 0) {
        user.setToken(res.data.token);
        e.autologin && localStorage.setItem('token', res.data.token);
        message.success('登录成功');
        setLoginModalVisible(false);
        user.setUpdateFlag();
      } else {
        message.error(`登陆失败! ${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error('ORZ 服务器好像挂了');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: Models['POST/register']['Req']) => {
    try {
      setLoading(true);
      e.password = sha256('CrazyHer', e.password).toString();
      const res = await fetch['POST/register']({
        email: e.email,
        password: e.password,
        verifycode: e.verifycode,
      });
      if (res.code === 0) {
        message.success('注册成功，请登录！');
        setRegisterModalVisible(false);
        setLoginModalVisible(true);
      } else {
        message.error(`注册失败! ${res.message}`);
      }
    } catch (error) {
      console.error(error);
      message.error('ORZ 服务器好像挂了');
    } finally {
      setLoading(false);
    }
  };
  const handleSend = async (e: Models['POST/sendcode']['Req']) => {
    try {
      setLoading(true);
      const res = await fetch['POST/sendcode'](e);
      if (res.code === 0) {
        setHasSent(true);
      }
    } catch (error) {
      console.error(error);
      message.error('ORZ 服务器好像挂了');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Layout className='App'>
      <Layout.Header
        style={{ backgroundColor: 'rgb(49, 65, 86)', color: 'white' }}>
        <div className='header'>
          <h1>山大校园网端口映射</h1>
          {!user.token && (
            <Button type='text' onClick={() => setLoginModalVisible(true)}>
              <h3>登录</h3>
            </Button>
          )}
        </div>
        <Modal
          title='登录'
          visible={loginModalVisible}
          footer={null}
          onCancel={() => setLoginModalVisible(false)}>
          <Form
            name='normal_login'
            className='login-form'
            labelCol={{ span: 3 }}
            initialValues={{ remember: true }}
            onFinish={(e) => handleLogin(e)}>
            <Form.Item
              label='邮箱'
              name='email'
              rules={[{ required: true, message: '请输入邮箱' }]}>
              <Input type='email' placeholder='Email' />
            </Form.Item>
            <Form.Item
              label='密码'
              name='password'
              rules={[{ required: true, message: '请输入密码' }]}>
              <Input type='password' placeholder='密码' />
            </Form.Item>
            <Form.Item>
              <Form.Item name='autologin' valuePropName='checked' noStyle>
                <Checkbox>自动登录</Checkbox>
              </Form.Item>
            </Form.Item>
            <Form.Item>
              <Button
                loading={loading}
                type='primary'
                htmlType='submit'
                className='login-form-button'>
                登录
              </Button>
              <Button
                type='link'
                onClick={() => {
                  setLoginModalVisible(false);
                  setRegisterModalVisible(true);
                }}>
                注册
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title='注册'
          visible={registerModalVisible}
          footer={null}
          onCancel={() => setRegisterModalVisible(false)}>
          <Form
            className='register-form'
            labelCol={{ span: 4 }}
            form={registerForm}
            onReset={() => registerForm.resetFields()}
            onFinish={handleRegister}>
            <Form.Item
              label='山大邮箱'
              name='email'
              hasFeedback
              validateFirst
              rules={[
                { required: true, message: '请输入山大邮箱' },
                { type: 'email', message: '请输入有效的山大邮箱' },
                {
                  pattern: RegExp('sdu.edu.cn$'),
                  message: '请输入有效的山大邮箱',
                },
              ]}>
              <Input type='email' />
            </Form.Item>
            <Form.Item label='验证码' required>
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item
                    name='verifycode'
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: '请输入收到的验证码',
                      },
                    ]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Button
                    loading={loading}
                    disabled={hasSent}
                    onClick={async () => {
                      try {
                        await registerForm.validateFields(['email']);
                        handleSend({
                          email: registerForm.getFieldValue('email'),
                        });
                      } catch (error) {
                        console.error(error);
                      }
                    }}>
                    {hasSent ? '已发送' : '发送验证码'}
                  </Button>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item
              label='密码'
              name='password'
              hasFeedback
              rules={[{ required: true, message: '请输入密码！' }]}>
              <Input.Password />
            </Form.Item>

            <Form.Item
              name='confirm'
              label='确认密码'
              hasFeedback
              dependencies={['password']}
              rules={[
                { required: true, message: '请再次输入密码！' },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('重复密码输入不符！');
                  },
                }),
              ]}>
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button
                className='register-btn'
                type='primary'
                htmlType='submit'
                loading={loading}>
                注册
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Layout.Header>
      <Layout.Content>{props.children}</Layout.Content>
    </Layout>
  );
};

export default inject('user')(observer(HLayout));
