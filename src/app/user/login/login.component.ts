import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  credentials  = {
    email : '',
    password : ''
  }
  showAlert = false;
  alertColor = '';
  alertMsg = '';
  
  constructor() { }
  
  login(){
    this.showAlert=true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please Wait! While we hack your account :)'
  }

  ngOnInit(): void {
  }

}
