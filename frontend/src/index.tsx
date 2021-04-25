import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { overrideFetch } from './rapper';
import { Provider } from 'mobx-react';
import stores from './store/index'; //使用mobx状态管理
// mock后端接口数据
overrideFetch({ prefix: 'http://rap2api.taobao.org/app/mock/282201' });
ReactDOM.render(
  <Provider {...stores}>
    <App />
  </Provider>,
  document.getElementById('root')
);
