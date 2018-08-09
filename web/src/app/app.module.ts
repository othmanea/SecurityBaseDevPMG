import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from './shared/sharedModules/material.module';
import { FontAweSomeModule } from './shared/sharedModules/fontAweSome.module';
import { PrimeNGModule} from './shared/sharedModules/primeNG.module';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


import { APP_ROUTING, APP_ROUTING_PROVIDERS } from './app.routes';

import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoDetailsComponent } from './todo-details/todo-details.component';
import { UsersComponent } from './users/users.component';

import { DocumentPageComponent } from './documents/document-page/document-page.component';
import { DocumentListComponent } from './documents/document-list/document-list.component';

import { LoginComponent } from './login/login.component';
import {RegisterComponent} from './register/register.component';
import { ConfirmComponent } from './shared/confirm/confirm.component';

import { SignupComponent } from './signup/signup.component';
import {CarouselComponent} from './shared/carousel/carousel.component';


import { WakandaService } from './shared/wakanda.service';
import { TodoService } from './shared/todo.service';
import { UserService } from './shared/user.service';
import { RegisterService} from './register/register.service';
import { AuthenticationService } from './shared/authentication.service';
import {DocumentService} from './shared/document.service';
import { BreadcrumbService } from './primeng/breadcrump/breadcrumb.service';
import { BreadcrumpComponent } from './primeng/breadcrump/breadcrump.component';





@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoDetailsComponent,
    UsersComponent,
    HomeComponent,
    ConfirmComponent,
    LoginComponent,
    RegisterComponent,
    UsersComponent,
    SignupComponent,
    CarouselComponent,
    BreadcrumpComponent,
    DocumentPageComponent,
    DocumentListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FontAweSomeModule,
    PrimeNGModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    APP_ROUTING
  ],
  entryComponents: [ConfirmComponent],
  providers: [
    APP_ROUTING_PROVIDERS,
    WakandaService,
    TodoService,
    UserService,
    RegisterService,
    AuthenticationService,
    DocumentService,
    BreadcrumbService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
