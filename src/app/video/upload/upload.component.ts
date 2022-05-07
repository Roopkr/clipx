import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  isDragover = false;
  file: File | null = null
  firstStepComplete = false;
  title = new FormControl('title', [
    Validators.required,
    Validators.minLength(3)
  ])

  uploadForm = new FormGroup({
    title: this.title
  })
  constructor() { }

  ngOnInit(): void {
  }

  storeFile($event: Event) {
    this.isDragover = false;
    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null;
    if (!this.file
      || this.file.type != 'video/mp4'
    ) {
      return
    }
    this.firstStepComplete = true;
    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''))
  }

  uploadFile() {
    console.log(this.title.value)
  }

}
