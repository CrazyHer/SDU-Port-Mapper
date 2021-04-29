import { Card } from 'antd';
import Drawer from './drawer';
import Table from './table';
const Index = (props: any) => {
  return (
    <Card>
      <Drawer />
      <Table />
    </Card>
  );
};
export default Index;
