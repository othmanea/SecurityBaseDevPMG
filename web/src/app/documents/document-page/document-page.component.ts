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

  doc: IDocument;
  docSub: Subscription;

  constructor(
    private documentService: DocumentService
  ) { }

  ngOnInit() {
    this.docSub = this.doc$.subscribe(
      doc => this.doc = doc
    );
  }

  ngOnDestroy() {
    this.docSub.unsubscribe();
  }

  saveDoc() {
    this.editChange.emit(false);
  }

  editDoc() {
    this.editChange.emit(true);
  }

  deleteDoc() {}

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
