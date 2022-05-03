import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: ''
  }
  showAlert = false;
  alertColor = '';
  alertMsg = '';
  inProgress = false;

  constructor(private auth: AngularFireAuth) { }

  async login() {
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please Wait! While we hack your account :)'
    try {
      this.inProgress = true;
      await this.auth.signInWithEmailAndPassword(this.credentials.email, this.credentials.password)
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

  ngOnInit(): void {
  }

}
