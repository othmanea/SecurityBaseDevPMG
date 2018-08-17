import { Injectable } from '@angular/core';
import { WakandaService } from './wakanda.service';
import { IDocument } from './interfaces';
import { BehaviorSubject, Observable, combineLatest, Subject } from 'rxjs';
import { map, switchMap, startWith, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DocumentService {


  constructor(
    private wakandaService: WakandaService
  ) {
    this.current$ = new BehaviorSubject<IDocument>(
      { ID: '', docCategory: 'default', docCode: 'default', docTitle: 'default', docRecordDate: 'default'}
    );
  }

  _documents: IDocument[];
  _index: number;

  current$: BehaviorSubject<IDocument>;

  set documents(docs: IDocument[]) {
    this._index = 0;
    this._documents = docs;
    this.current$.next(this._documents[this._index]);
  }

  get current(): Observable<IDocument> {
    return this.current$.asObservable();
  }

  previous() {
    this._index = ((this._index - 1) + this._documents.length) % this._documents.length;
    this.current$.next(this._documents[this._index]);
  }

  next() {
    this._index = (this._index + 1) % this._documents.length;
    this.current$.next(this._documents[this._index]);
  }

  last() {
    this._index = this._documents.length - 1;
    this.current$.next(this._documents[this._index]);
  }

  first() {
    this._index = 0;
    this.current$.next(this._documents[this._index]);
  }

  async getClass() {
    const ds = await this.wakandaService.catalog;
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

  async saveDoc(doc: IDocument) {
    const entity = await this.findById(doc.ID);
    entity.docTitle = doc.docTitle;
    entity.docCode = doc.docCode;
    const res = await entity.save();
    return res;
  }

  async deleteDoc(doc: IDocument) {
    const entity = await this.findById(doc.ID);
    const res = await entity.delete();
    return res;
  }

  async findById(ID: string) {
    const documentClass = await this.getClass();
    const entity = await documentClass.find(ID);
    // this.entity$.next(entity);
    return entity;
  }

}
