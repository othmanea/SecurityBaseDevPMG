import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../primeng/breadcrump/breadcrumb.service';

import { MenuItem } from 'primeng/primeng';

import { IDocument } from '../../shared/interfaces';
import { DocumentService } from '../../shared/document.service';
// import { TableModule } from '../../shared/sharedModules/primeNG.modules';
// import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {

  docs: IDocument[];
  countDoc = 0;
  cols: any[];
  first = 0;
  selectedDoc: IDocument;
  selectedDocs: IDocument[];
  newDoc: boolean = false;
  editDoc:boolean = false;
  deleteDoc:boolean = false;

  items: MenuItem[];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private documentService: DocumentService
  ) {

    this.breadcrumbService.setItems([
      { label: 'Documents', routerLink: ['/documents'] }
    ]);
    this.refresh();
  }

  ngOnInit() {
    this.cols = [
      { field: 'docTitle', header: 'Titre' },
      { field: 'docCode', header: 'Réf.' },
      { field: 'ID', header: 'ID' },
  ];
  this.items = [
    {label: 'All Data', icon: 'fas fa-file', command: () => {
      //this.exportCSV(); 
       //"dt.exportCSV()"
      // this.update();
    }},
    {label: 'Selected data only', icon: 'far fa-file', command: () => {
        // dt.exportCSV({selectionOnly:true})
    }}
];

  }
  private setData(d: {
    list: IDocument[];
    count: number;
  }) {
    this.docs = d.list;
    this.countDoc = d.count;
  }
  reset() {
    this.first = 0;
  }
  async refresh() {
    const result = await this.documentService.getAll();
    this.setData(result);
  }
}
