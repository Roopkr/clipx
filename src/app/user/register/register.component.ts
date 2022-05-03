import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  alertMsg = '';
  showAlert = false;
  alertColor = 'blue';
  inProgress = false;

  constructor(
    private auth: AuthService
  ) {

  }
  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ])
  email = new FormControl('', [
    Validators.required,
    Validators.email
  ])
  age = new FormControl('', [
    Validators.required,
    Validators.min(7),
    Validators.max(120)
  ])
  password = new FormControl('', [
    Validators.required,
    Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$')
  ])
  confirm_password = new FormControl('', [
    Validators.required
  ])
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.min(1000000000),
    Validators.max(9999999999)
  ])

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    phoneNumber: this.phoneNumber
  })
  

  async register() {
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please Wait! We are selling your personal information :)';
    const { email, password } = this.registerForm.value;

    try {
      this.inProgress = true;
      await this.auth.createuser(this.registerForm.value)
    }

    catch (e) {
      this.inProgress = false;
      this.alertColor = 'red';
      this.alertMsg = 'Task failed successfully :(';
      console.error(e);
      return
    }

    this.alertColor = 'green';
    this.alertMsg = 'Info sold successfully ;)';

  }

}
