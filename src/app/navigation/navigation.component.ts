import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor(
    private ModalService: ModalService,
    public auth: AuthService,
    public af: AngularFireAuth
  ) { }

  onAuthClick(event: Event) {
    event.preventDefault();
    this.ModalService.toggleModalVisibility('auth');
  }
  ngOnInit(): void {
  }

  async logout($event: Event) {
    $event.preventDefault();
    await this.af.signOut()


  }

}
