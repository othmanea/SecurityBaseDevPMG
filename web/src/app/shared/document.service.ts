import { Injectable } from '@angular/core';
import { WakandaService } from './wakanda.service';
import { IDocument } from './interfaces';


@Injectable()

export class DocumentService {

  constructor(
    private wakanda: WakandaService
  ) {

  }
  async getClass() {
    const ds = await this.wakanda.catalog;
    return ds.Document;
  }

  async getAll(opts: {
    pageSize: number;
    start: number;
    filter?: string;
    params?: (string)[];
    orderBy?: string
  } = {
    pageSize: 100,
    start: 0
  }): Promise<{
        list: IDocument[];
        count: number;
      }> {
     const Document = await this.getClass();
     const res = await Document.query(opts);

     return {
       list: res.entities,
       count: res._count
     };
  }

}
