import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 } from 'uuid';
import { last, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  isDragover = false
  file: File | null = null
  firstStepComplete = false
  uploadProgress = 0
  showAlert = false
  alertColor = ''
  alertMsg = ''
  inProgress = false
  showPercent = false
  user: firebase.User | null = null
  title = new FormControl('title', [
    Validators.required,
    Validators.minLength(3)
  ])

  uploadForm = new FormGroup({
    title: this.title
  })


  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipService : ClipService
  ) {
    auth.user.subscribe(user => {
      this.user = user
    })
  }

  ngOnInit(): void {
  }

  storeFile($event: Event) {
    this.isDragover = false;
    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null
    if (!this.file
      || this.file.type != 'video/mp4'
    ) {
      return
    }
    this.firstStepComplete = true;
    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''))
  }

  uploadFile() {
    this.uploadForm.disable()
    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMsg = 'Please Wait! While we sell your video on dark web ;)'
    this.inProgress = true
    this.showPercent = true

    const fileName = v4()
    const clipPath = `clips/${fileName}.mp4`




    const task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath)
    task.percentageChanges().subscribe(progress => {
      this.uploadProgress = progress ?? 0;
    })

    task.snapshotChanges().pipe(
      last(),
      switchMap(() => clipRef.getDownloadURL())
    ).subscribe({
      next: (url) => {
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value as string,
          fileName: `${fileName}.mp4` as string,
          url: url as string
        }

        this.clipService.createClip(clip)

        this.showAlert = true;
        this.alertColor = 'green';
        this.alertMsg = 'Video sold successfully :)'
        this.showPercent = false;
      },
      error: (error) => {
        this.showAlert = true
        this.alertColor = 'red'
        this.inProgress = false
        this.alertMsg = 'Task failed successfully:('
        this.showPercent = false
        this.uploadForm.enable()

      }

    })
  }


}
