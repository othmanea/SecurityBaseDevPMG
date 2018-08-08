import { Component, OnDestroy } from '@angular/core';
import {
  AuthenticationService,
  ICurrentUser
} from './shared/authentication.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();

  currentUser: ICurrentUser;
  canSeeTodosMenu = false;
  canSeeUsersMenu = false;

  constructor(
    public authenticationService: AuthenticationService,
    private router: Router
  ) {
    authenticationService.currentUser
      .pipe(
        takeUntil(this.unsubscribe$),
        tap(u => (this.currentUser = u)),
        tap(async (u) => {
// Ability to show menus # Access to the data or the page underneath that Menu -> Guard.service
          this.canSeeTodosMenu = await authenticationService.hasRole('BasicUsers');
          this.canSeeUsersMenu = await authenticationService.hasRole('Admin');
        }),
      )
      .subscribe();
    this.authenticationService.refreshUser();
  }

  async logout() {
    await this.authenticationService.logout();
    this.router.navigate(['login']);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
