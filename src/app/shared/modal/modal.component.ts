import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() modalId:string = '';
  constructor(public ModalService : ModalService) { 
  }

  ngOnInit(): void {
  }
  closeModal(event : Event){
    this.ModalService.toggleModalVisibility(this.modalId);
  }
}
