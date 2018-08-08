import { Injectable } from '@angular/core';
import { WakandaService } from '../shared/wakanda.service';


@Injectable()
export class RegisterService {

  constructor(private wakandaService: WakandaService) {

  }

  register(body): Promise<any> {

    return new Promise((resolve, reject) => {
     this.wakandaService.catalog.then(ds => {
        ds.User.addUser(body).then(res => {
          resolve(res);
        }).catch((error) => {
          reject(error.message);
        });
      });

    });
  }


}
