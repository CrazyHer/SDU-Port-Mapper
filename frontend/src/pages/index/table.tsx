/* eslint-disable react-hooks/exhaustive-deps */
import { Table, Button, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import copy from 'copy-to-clipboard';
import { fetch, Models } from '../../rapper';
import User from '../../store/user';

const HTable = (props: any) => {
  const [data, setData] = useState<Models['GET/getlist']['Res']['data']>();
  const user = props.user as User;
  const [loading, setLoading] = useState<boolean>(false);

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
  }, [user.updateFlag]);

  const handleDel = async (port: number) => {
    setLoading(true);
    try {
      const res = await fetch['POST/del']({ outerPort: port });
      if (res.code === 0) {
        message.success('删除成功');
        user.setUpdateFlag();
      } else {
        message.error(`删除失败：${res.message}`);
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
    { title: '创建者', dataIndex: 'creator', width: '10em' },
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
                  if (record.type === 'http') {
                    copy(`http://sdu.herui.club:${record.outerPort}`);
                    message.success(
                      `成功复制http://sdu.herui.club:${record.outerPort}到剪切板`
                    );
                  } else {
                    copy(`sdu.herui.club:${record.outerPort}`);
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
    <Table
      loading={loading}
      columns={columns}
      dataSource={data?.map((v) => ({ ...v, key: v.outerPort }))}
      scroll={{ x: '100%' }}
    />
  );
};

export default inject('user')(observer(HTable));
