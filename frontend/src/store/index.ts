import { configure } from 'mobx';
import User from './user';

configure({ enforceActions: 'observed' });

const user = new User();

const stores = { user };
export default stores;
