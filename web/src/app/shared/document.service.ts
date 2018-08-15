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
    private wakanda: WakandaService
  ) {
    this.current$ = new BehaviorSubject<IDocument>({ ID: '', docCategory: 'default', docCode: 'default', docTitle: 'default' });
    // this.current$.subscribe(
    //   doc => this.findById(doc.ID)
    // );
  }

  // _selectedDocs: IDocument[];
  // _currentIndex: number;

  // _move$ = new Subject<string>();
  // _selectedDocs$ = new BehaviorSubject<IDocument[]>([]);

  // _size$ = this._selectedDocs$.pipe(
  //   map((docs: IDocument[]) => docs.length)
  // );

  // _currentIndex$: Observable<number> = combineLatest(
  //   this._currentIndex$,
  //   this._size$,
  //   this._move$.asObservable(),
  // ).pipe(
  //   map(([i, sz, dir]) => dir === 'PREV' ? ((i - 1) + sz) % sz : (i + 1) % sz)
  // ).pipe(
  //   startWith(0)
  // );

  // previousDoc() {
  //   this._move$.next('PREV');
  // }

  // nextDoc() {
  //   this._move$.next('NEXT');
  // }

  // setSelectedDocs(docs: IDocument[]) {
  //   this._selectedDocs = docs;
  //   this._currentIndex = 0;
  //   this._selectedDocs$.next(docs);
  // }

  // get selectedDocs$(): Observable<IDocument[]> {
  //   return this._selectedDocs$.asObservable();
  // }

  // get currentDoc$(): Observable<IDocument> {
  //   return combineLatest(
  //     this._currentIndex$,
  //     this._selectedDocs$
  //   ).pipe(
  //     map(([i, docs]) => docs[i])
  //   );
  // }

  _documents: IDocument[];
  _index: number;

  current$: BehaviorSubject<IDocument>;
  entity$ = new BehaviorSubject<any>({});

  set documents(docs: IDocument[]) {
    this._index = 0;
    this._documents = docs;
    this.current$.next(this._documents[this._index]);
  }

  get entity() {
    return this.entity$.asObservable();
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
