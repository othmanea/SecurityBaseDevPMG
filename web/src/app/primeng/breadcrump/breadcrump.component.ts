import { Component, OnDestroy } from '@angular/core';
import { BreadcrumbService } from './breadcrumb.service';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/primeng';

@Component({
  selector: 'app-breadcrump',
  templateUrl: './breadcrump.component.html',
  styleUrls: ['./breadcrump.component.css']
})
export class BreadcrumpComponent implements OnDestroy {

  subscription: Subscription;

  items: MenuItem[];

  constructor(public breadcrumbService: BreadcrumbService) {
      this.subscription = breadcrumbService.itemsHandler.subscribe(response => {
          this.items = response;
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
        this.subscription.unsubscribe();
    }
  }
}

