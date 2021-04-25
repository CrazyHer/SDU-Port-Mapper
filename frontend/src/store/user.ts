import { action, makeAutoObservable } from 'mobx';

export default class User {
  constructor() {
    makeAutoObservable(this);
    this.token = localStorage.getItem('token') || '';
  }
  token: string;
  @action setToken(token: string) {
    this.token = token;
  }
}
