import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { v4 } from 'uuid';
import { last, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnDestroy {

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
  task?: AngularFireUploadTask

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
    private clipService: ClipService,
    private router: Router
  ) {
    auth.user.subscribe(user => {
      this.user = user
    })
  }

  ngOnDestroy(): void {
    this.task?.cancel()
  }

  storeFile($event: Event) {
    this.isDragover = false;
    this.file = ($event as DragEvent).dataTransfer ?
      ($event as DragEvent).dataTransfer?.files.item(0) ?? null :
      ($event.target as HTMLInputElement).files?.item(0) ?? null
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




    this.task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath)

    this.task.percentageChanges().subscribe(progress => {
      this.uploadProgress = progress ?? 0;
    })

    this.task.snapshotChanges().pipe(
      last(),
      switchMap(() => clipRef.getDownloadURL())
    ).subscribe({
      next: async (url) => {
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value as string,
          fileName: `${fileName}.mp4` as string,
          url: url as string,
          timestamp : firebase.firestore.FieldValue.serverTimestamp()
        }

        const clipDocRef = await this.clipService.createClip(clip)

        setTimeout(() => {
          this.router.navigate([
            'clips', clipDocRef.id
          ])
        }, 1000)

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
