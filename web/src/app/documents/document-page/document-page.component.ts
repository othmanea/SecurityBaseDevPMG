import { Component, OnInit, Input, Output, OnDestroy } from '@angular/core';
import { IDocument } from '../../shared/interfaces';
import { DocumentService } from '../../shared/document.service';
import { EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-document-page',
  templateUrl: './document-page.component.html',
  styleUrls: ['./document-page.component.css']
})
export class DocumentPageComponent implements OnInit, OnDestroy {

  @Input()
  doc$: Observable<IDocument>;

  @Input()
  display: boolean;

  @Input()
  edit: boolean;

  @Output()
  editChange = new EventEmitter<boolean>();

  @Output()
  displayChange = new EventEmitter<boolean>();

  @Output()
  refresh = new EventEmitter();

  doc: IDocument;
  model: IDocument;

  docSub: Subscription;

  constructor(
    private documentService: DocumentService
  ) { }

  ngOnInit() {
    this.docSub = this.doc$.subscribe(
      (doc) => {
        const { ID, docCode, docTitle, docCategory, docFile } = doc;
        this.model = { ID, docCode, docTitle, docCategory, docFile };
        this.doc = doc;
      }
    );
  }

  ngOnDestroy() {
    this.docSub.unsubscribe();
  }

  async saveDoc() {
    try {
      const res = await this.documentService.saveDoc(this.model);
      // Do this so we change the object watched by angular reflecting changes in the table
      const { docCode, docTitle, docCategory, docFile } = res;
      this.doc.docCode = docCode;
      this.doc.docCategory = docCategory;
      this.doc.docTitle = docTitle;
      this.doc.docFile = docFile;
    } catch (err) {
      console.log(err);
      // Reset the model on error
      this.model = { ...this.doc };
    }
    this.editChange.emit(false);
  }

  editDoc() {
    this.editChange.emit(true);
  }

  async deleteDoc() {
    const res = await this.documentService.deleteDoc(this.doc);
    this.nextSelectedDoc();
    this.refresh.emit();
  }

  firstSelectedDoc() {}

  lastSelectedDoc() {}

  previousSelectedDoc() {
    this.documentService.previous();
  }

  nextSelectedDoc() {
    this.documentService.next();
  }

  cancel() {
    this.editChange.emit(false);
    this.displayChange.emit(false);
  }

}
