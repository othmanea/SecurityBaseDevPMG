import { Component, OnInit, Input } from '@angular/core';
import { IDocument } from '../../shared/interfaces';
import { DocumentService } from '../../shared/document.service';

@Component({
  selector: 'app-document-page',
  templateUrl: './document-page.component.html',
  styleUrls: ['./document-page.component.css']
})
export class DocumentPageComponent implements OnInit {
 @Input() doc: IDocument;
  display: boolean;

  constructor(
    private documentService: DocumentService
  ) { }

  ngOnInit() {
    this.display = true;
  }

}
