import { Spin } from 'antd';
import React, { lazy, Suspense } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Layout from './components/layout';

const Index = lazy(() => import('./pages/index'));
const App = () => {
  return (
    <Router>
      <Layout>
        <Suspense
          fallback={
            <Spin
              spinning={true}
              style={{ top: '50%', position: 'absolute' }}
            />
          }>
          <Switch>
            <Route path='/'>
              <Index />
            </Route>
          </Switch>
        </Suspense>
      </Layout>
    </Router>
  );
};
export default App;
