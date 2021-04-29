import { Button, message, Drawer, Form, Input, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { inject, observer } from 'mobx-react';
import React, { useState } from 'react';

import { fetch, Models } from '../../rapper';
import User from '../../store/user';

const HDrawer = (props: any) => {
  const [form] = useForm();
  const user = props.user as User;
  const [loading, setLoading] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  const handleAdd = async (e: Models['POST/add']['Req']) => {
    setLoading(true);
    try {
      const res = await fetch['POST/add'](e);
      if (res.code === 0) {
        message.success('添加成功');
        setDrawerVisible(false);
        form.resetFields();
        user.setUpdateFlag();
      } else {
        message.error(`添加失败：${res.message}`);
      }
    } catch (error) {
      message.error('ORZ 服务器好像挂了');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        type='primary'
        style={{ float: 'right' }}
        onClick={() => setDrawerVisible(true)}>
        添加
      </Button>
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
  )}' 'http://sdu.herui.club:${form.getFieldValue('outerPort')}';
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
    </div>
  );
};
export default inject('user')(observer(HDrawer));
