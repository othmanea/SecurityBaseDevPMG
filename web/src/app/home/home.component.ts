import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService, ICurrentUser } from '../shared/authentication.service';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { BreadcrumbService } from '../primeng/breadcrump/breadcrumb.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();

  currentUser: ICurrentUser;

  constructor(
    private breadcrumbService: BreadcrumbService,
    authenticationService: AuthenticationService
  ) {
    authenticationService.currentUser.pipe(
      takeUntil(this.unsubscribe$),
      tap(u => this.currentUser = u),
    ).subscribe();

    this.breadcrumbService.setItems([
      { label: 'Home', routerLink: ['/home'] }
  ]);

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
