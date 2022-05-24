import { Component, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import IClip from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';
import { ClipService } from 'src/app/services/clip.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {

  @Input() activeClip: IClip | null = null
  @Output() update = new EventEmitter()

  alertColor = ''
  alertMsg = ''
  inProgress = false
  showAlert = false
  clipId = new FormControl('')
  title = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ])

  editForm = new FormGroup({
    title: this.title
  })

  constructor(private modal: ModalService, private clipService: ClipService) { }

  ngOnInit(): void {
    this.modal.Register('editClip')
  }

  ngOnChanges(): void {
    if (!this.activeClip) {
      return
    }
    this.clipId.setValue(this.activeClip.documentID)
    this.title.setValue(this.activeClip.title)
  }


  ngOnDestroy(): void {
    this.modal.Unregister('editClip')
  }

  async submit() {
    if (!this.activeClip) {
      return
    }

    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMsg = 'Please Wait! While we upadte your video on dark web ;)'
    this.inProgress = true

    try {
      await this.clipService.updateClip(this.clipId.value, this.title.value)

      this.activeClip.title = this.title.value;
      this.update.emit(this.activeClip)
      this.alertColor = 'green';
      this.alertMsg = 'Video upadted successfully :)'

      setTimeout(()=>{
        this.modal.toggleModalVisibility('editClip')
      },1000)

    }

    catch (e) {
      this.showAlert = true
      this.alertColor = 'red'
      this.inProgress = false
      this.alertMsg = 'Task failed successfully:('
    }

  }

}
