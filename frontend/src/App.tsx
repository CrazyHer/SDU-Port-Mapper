/* eslint-disable react-hooks/exhaustive-deps */
import {
  Layout,
  Card,
  Table,
  Button,
  message,
  Drawer,
  Form,
  Input,
  Select,
  Modal,
  Checkbox,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { ColumnsType } from 'antd/lib/table';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import sha256 from 'crypto-js/hmac-sha256';

import './App.css';
import { fetch, Models } from './rapper';
import User from './store/user';

const App = (props: any) => {
  const [form] = useForm();
  const [data, setData] = useState<Models['GET/getlist']['Res']['data']>();
  const [updateFlag, setUpdateFlag] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const user = props?.user as User;

  useEffect(() => {
    if (user.token) {
      setLoading(true);
      fetch['GET/getlist']()
        .then((res) => {
          if (res.code === 0) {
            setData(res.data);
          } else {
            message.warning('登录状态过期，请重新登录');
            user.setToken('');
            localStorage.clear();
          }
        })
        .catch((err) => {
          message.error('啊哦！服务器好像挂了ORZ');
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [updateFlag]);

  const handleAdd = async (e: Models['POST/add']['Req']) => {
    setLoading(true);
    try {
      const res = await fetch['POST/add'](e);
      if (res.code === 0) {
        message.success('添加成功');
        setDrawerVisible(false);
        form.resetFields();
        setUpdateFlag(!updateFlag);
      } else {
        message.error(`添加失败：${res.message}`);
      }
    } catch (error) {
      message.error('ORZ 服务器好像挂了');
    } finally {
      setLoading(false);
    }
  };

  const handleDel = async (port: number) => {
    setLoading(true);
    try {
      const res = await fetch['POST/del']({ outerPort: port });
      if (res.code === 0) {
        message.success('删除成功');
        setUpdateFlag(!updateFlag);
      } else {
        message.error(`删除失败：${res.message}`);
      }
    } catch (error) {
      message.error('ORZ 服务器好像挂了');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: {
    email: string;
    password: string;
    autologin: boolean;
  }) => {
    setLoading(true);
    try {
      e.password = sha256('CrazyHer', e.password).toString();
      const res = await fetch['POST/login'](e);
      if (res.code === 0) {
        user.setToken(res.data.token);
        e.autologin && localStorage.setItem('token', res.data.token);
        message.success('登录成功');
        setModalVisible(false);
        setUpdateFlag(!updateFlag);
      } else {
        message.error(`登陆失败! ${res.message}`);
      }
    } catch (error) {
      message.error('ORZ 服务器好像挂了');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<object> = [
    {
      title: '端口',
      dataIndex: 'outerPort',
      width: '5em',
      fixed: 'left',
      align: 'center',
    },
    { title: '校园网内部地址', dataIndex: 'innerAdress', width: '15em' },
    { title: '类型', dataIndex: 'type', width: '6em', align: 'center' },
    { title: '备注', dataIndex: 'comment', width: '10em' },
    { title: '创建者', dataIndex: 'author', width: '10em' },
    {
      title: '操作',
      width: '8em',
      align: 'center',
      render: (value, record: any, index) => {
        return (
          <span>
            <Button type='link' onClick={() => handleDel(record.outerPort)}>
              删除
            </Button>
            <Button
              type='link'
              onClick={async () => {
                try {
                  await navigator.permissions.query({
                    name: 'clipboard-write',
                  });
                  if (record.type === 'http') {
                    await navigator.clipboard.writeText(
                      `http://sdu.herui.club:${record.outerPort}`
                    );
                    message.success(
                      `成功复制http://sdu.herui.club:${record.outerPort}到剪切板`
                    );
                  } else {
                    await navigator.clipboard.writeText(
                      `sdu.herui.club:${record.outerPort}`
                    );
                    message.success(
                      `成功复制sdu.herui.club:${record.outerPort}到剪切板`
                    );
                  }
                } catch (error) {
                  message.error('复制失败! 怕不是浏览器不支持QAQ');
                  console.error(error);
                }
              }}>
              复制地址
            </Button>
          </span>
        );
      },
    },
  ];
  return (
    <Layout className='App'>
      <Layout.Header
        style={{ backgroundColor: 'rgb(49, 65, 86)', color: 'white' }}>
        <div className='header'>
          <h1>山大校园网端口映射</h1>
          {!user.token && (
            <Button type='text' onClick={() => setModalVisible(true)}>
              <h3>登录</h3>
            </Button>
          )}
        </div>
      </Layout.Header>
      <Layout.Content>
        <Card>
          <Button
            type='primary'
            style={{ float: 'right' }}
            onClick={() => setDrawerVisible(true)}>
            添加
          </Button>

          <Table
            loading={loading}
            columns={columns}
            dataSource={data?.map((v) => ({ ...v, key: v.outerPort }))}
            scroll={{ x: '100%' }}
          />
        </Card>
        <Drawer
          title='端口映射配置'
          visible={drawerVisible}
          onClose={() => setDrawerVisible(false)}
          width='300px'>
          <Form
            labelCol={{ span: 9 }}
            labelAlign='left'
            layout='vertical'
            form={form}
            onFinish={(e) =>
              handleAdd({
                outerPort: e.outerPort,
                type: e.type,
                data: {
                  proxyPass: e.proxy_pass,
                  optherOptions: e.otherOptions,
                },
                comment: e.comment,
              })
            }>
            <Form.Item
              name='outerPort'
              label='端口号'
              rules={[
                { required: true, message: '请填写端口号' },
                {
                  transform: (v) => Number(v),
                  type: 'number',
                  min: 6000,
                  max: 6050,
                  message: '端口号介于6000-6050之间',
                },
              ]}>
              <Input type='number' min={6000} max={6050} />
            </Form.Item>
            <Form.Item
              name='type'
              label='映射类型'
              initialValue='stream'
              rules={[{ required: true }]}>
              <Select>
                <Select.Option value='stream'> stream </Select.Option>
                <Select.Option value='http'> http </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name='proxy_pass'
              label='proxy_pass'
              rules={[
                { required: true, message: '请输入内网地址' },
                {
                  pattern: RegExp('^(?!.*?[{\\\\};]).*$'),
                  message: '非法格式!',
                }, //不允许输入 \ { } ;字符
              ]}>
              <Input
                onChange={(e) => {
                  if (form.getFieldValue('type') === 'http') {
                    form.setFieldsValue({
                      otherOptions: `proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection upgrade;
proxy_set_header Accept-Encoding "";
sub_filter '${form.getFieldValue(
                        'proxy_pass'
                      )}' 'http://sdu.herui.club:${form.getFieldValue(
                        'outerPort'
                      )}';
sub_filter_once off;`,
                    });
                  } else {
                    form.setFieldsValue({ otherOptions: `` });
                  }
                }}
              />
            </Form.Item>
            <Form.Item
              name='otherOptions'
              label='其他配置项'
              rules={[
                {
                  pattern: RegExp('^(?!.*?[{\\\\}]).*$', 's'),
                  message: '非法格式!',
                },
              ]}>
              <Input.TextArea autoSize />
            </Form.Item>
            <Form.Item
              name='comment'
              label='备注'
              rules={[{ required: true, message: '请输入备注信息' }]}>
              <Input.TextArea autoSize />
            </Form.Item>
            <Form.Item>
              <Button loading={loading} htmlType='submit' type='primary'>
                提交
              </Button>
              <Button
                htmlType='reset'
                onClick={(e) => {
                  e.preventDefault();
                  setDrawerVisible(false);
                }}>
                取消
              </Button>
            </Form.Item>
          </Form>
        </Drawer>
        <Modal
          title='登录'
          visible={modalVisible}
          footer={null}
          onCancel={() => setModalVisible(false)}>
          <Form
            name='normal_login'
            className='login-form'
            initialValues={{ remember: true }}
            onFinish={handleLogin}>
            <Form.Item
              name='email'
              rules={[{ required: true, message: '请输入邮箱' }]}>
              <Input type='email' placeholder='Email' />
            </Form.Item>
            <Form.Item
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
              <Button type='link' disabled={true}>
                注册
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Layout.Content>
    </Layout>
  );
};
export default inject('user')(observer(App));
