import { Injectable } from '@angular/core';
import { WakandaClient } from 'wakanda-client/browser/no-promise';

const _client = new WakandaClient({});

export interface ICurrentUser {
  email: string;
  fullName: string;
  ID: string;
}

@Injectable()
export class WakandaService {
  private ds: Promise<any>;
  private currentUser: Promise<ICurrentUser>;

  constructor() {  }

  get catalog(): Promise<any> {
    if (!this.ds) {
      this.ds = _client.getCatalog();
    }
    return this.ds;
  }

  get directory() {
    return _client.directory;
  }

  get user(): Promise<ICurrentUser> {
    if (!this.currentUser) {
     return this.refreshUser();
    }
    return this.currentUser;
  }

  refreshUser() {
   return this.currentUser = _client.directory
      .getCurrentUser()
      .catch(() => { });
  }

  async login(username: string, password: string): Promise<boolean> {
    let isOK = false;
    try {
      isOK = await _client.directory.login(username, password);
    } catch (e) {
      isOK = false;
    }
    if (isOK) {
      this.refreshUser();
    }
    return isOK;
  }

  async logout(): Promise<boolean> {
    let isOK = false;
    try {
      isOK = await _client.directory.logout();
    } catch (e) {
      isOK = false;
    }
    if (isOK) {
      this.refreshUser();
    }
    return isOK;
  }

  async checkCredentials() {
    this.currentUser = await _client.directory.getCurrentUser();
    return this.currentUser;
  }

}
