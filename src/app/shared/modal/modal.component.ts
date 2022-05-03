import { Component, Input, OnInit,OnDestroy,ElementRef } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit,OnDestroy {

  @Input() modalId:string = '';
  constructor(
    public ModalService : ModalService,
    private el:ElementRef) { 
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
   // document.body.removeChild(this.el.nativeElement)
  }
  closeModal(event : Event){
    this.ModalService.toggleModalVisibility(this.modalId);
  }
}
