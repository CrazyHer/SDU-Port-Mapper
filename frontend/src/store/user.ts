import { action, makeAutoObservable } from 'mobx';
import { FETCH_ROOT_URL } from '../constants/fetch';
import { overrideFetch } from '../rapper';

export default class User {
  constructor() {
    makeAutoObservable(this);
    this.token = localStorage.getItem('token') || '';
    this.updateFlag = false;
    overrideFetch({
      prefix: FETCH_ROOT_URL,
      fetchOption: { headers: { token: this.token } },
    });
  }
  token: string;
  updateFlag: boolean;

  @action setToken(token: string) {
    this.token = token;
    overrideFetch({
      prefix: FETCH_ROOT_URL,
      fetchOption: { headers: { token: this.token } },
    });
  }

  @action setUpdateFlag() {
    this.updateFlag = !this.updateFlag;
  }
}
