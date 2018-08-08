import { Component, Output, EventEmitter, Input } from '@angular/core';

export interface IUserSignup {
  fullName: string;
  email: string;
  password: string;
  verifyPassword: string;
};

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  @Output() onSignup: EventEmitter<IUserSignup> = new EventEmitter();
  @Input() user: IUserSignup;
}
