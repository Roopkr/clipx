import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent{
  alertMsg = 'asd';
  showAlert = false;
  alertColor = 'blue';

  name = new FormControl('',[
    Validators.required,
    Validators.minLength(3)
  ])
  email = new FormControl('',[
    Validators.required,
    Validators.email
  ])
  age = new FormControl('',[
    Validators.required,
    Validators.min(7),
    Validators.max(120)
  ])
  password = new FormControl('',[
    Validators.required,
    Validators.pattern("^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$")
  ])
  confirm_password = new FormControl('',[
    Validators.required
  ])
  phoneNumber = new FormControl('',[
    Validators.required,
    Validators.min(1000000000),
    Validators.max(9999999999)
  ])

  registerForm = new FormGroup({
    name : this.name,
    email  :this.email,
    age : this.age,
    password : this.password,
    confirm_password : this.confirm_password,
    phoneNumber : this.phoneNumber
  })
  register(){
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please Wait! We are selling your personal information :)'
  }

}
