import { Component, OnInit } from '@angular/core';
import { RegisterService } from './register.service';
import { Router } from '@angular/router';
import { IUserSignup } from '../signup/signup.component';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private errorMsg: string;
  user: IUserSignup = {
    fullName: '',
    email: '',
    password: '',
    verifyPassword: ''
  };

  constructor(
    private registerService: RegisterService,
    private router: Router
  ) {

  }

  async register(user) {
    try {
      const res = await this.registerService.register(user);
      if(res && res.errorMessage){
        alert(res.errorMessage);
      }
    } catch (e) {
      alert('Error while signuping a new user');
    }
    this.router.navigate(['login']);
  }
  login() {
    this.router.navigate(['login']);
  }
  backhome() {
    this.router.navigate(['home']);
  }
}
