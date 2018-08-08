import { Injectable } from '@angular/core';

import { WakandaService } from './wakanda.service';
import { Subject } from 'rxjs';

export class User {
  constructor(public logon: string, public password: string) {}
}
export interface ICurrentUser {
  email: string;
  fullName: string;
  ID: string;
}

@Injectable()
export class AuthenticationService {
  currentUser: Subject<ICurrentUser> = new Subject();
  private roles: {
    [name: string]: Promise<boolean>;
  } = {};
  // private current: Promise<ICurrentUser>;

  constructor(private wakandaService: WakandaService) {}

  async login(username: string, password: string): Promise<boolean> {
    let isOK = false;
    try {
      isOK = await this.wakandaService.directory.login(username, password);
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
      isOK = await this.wakandaService.directory.logout();
    } catch (e) {
      isOK = false;
    }
    if (isOK) {
      this.refreshUser();
    }
    return isOK;
  }

  async refreshUser() {
    this.roles = {};
    this.wakandaService.refreshUser();
    const u = await this.wakandaService.user;
    this.currentUser.next(u);
  }

  async checkCredentials() {
    await this.wakandaService.checkCredentials();
  }

  hasRole(role: string): Promise<boolean> {
    if (typeof this.roles[role] === 'undefined') {
      this.roles[role] = this.wakandaService.directory.getCurrentUserBelongsTo(role);
    }
    return this.roles[role];
  }
}
