import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

import { WakandaService } from "./wakanda.service";
import { ConfirmComponent } from './confirm/confirm.component';
import { IUser } from "./interfaces";

@Injectable()
export class UserService {
  constructor(
    private wakanda: WakandaService,
    private dialog: MatDialog
  ) {

  }

  async getClass() {
    const ds = await this.wakanda.catalog;
    return ds.UserTodoAssign;
  }

  async getAll(opts: {
    pageSize: number;
    start: number;
    filter?: string;
    params?: (string)[];
    orderBy?: string
  } = {
    pageSize: 10,
    start: 0
  }): Promise<{
    list: IUser[];
    count: number;
  }> {
    const User = await this.getClass();
    const res = await User.query(opts);

    return {
      list: res.entities,
      count: res._count
    };
  }

  remove(User): Promise<any> {
    let dialogRef = this.dialog.open(ConfirmComponent, {
      width: '250px',
      data: { message: "Would you like to remove this entity?" }
    });

    return new Promise((resolve, reject) => {
      dialogRef.afterClosed().subscribe(async isYes => {
        if(isYes){
          await User.delete();
        }

        resolve(isYes);
      });
    });
  }
}
