import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { v4 } from 'uuid';
import { last, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';
import { combineLatest, forkJoin } from 'rxjs';

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
  screenshotTask?: AngularFireUploadTask
  screenshots: string[] = []
  selectedScreenshot: string = ''

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
    private router: Router,
    public ffmpegService: FfmpegService
  ) {
    auth.user.subscribe(user => {
      this.user = user
    })
    ffmpegService.init()
  }

  ngOnDestroy(): void {
    this.task?.cancel()
  }

  async storeFile($event: Event) {
    if (this.ffmpegService.isRunning) {
      return
    }
    this.isDragover = false;
    this.file = ($event as DragEvent).dataTransfer ?
      ($event as DragEvent).dataTransfer?.files.item(0) ?? null :
      ($event.target as HTMLInputElement).files?.item(0) ?? null
    if (!this.file
      || this.file.type != 'video/mp4'
    ) {
      return
    }
    this.screenshots = await this.ffmpegService.getScreenShots(this.file)
    this.selectedScreenshot = this.screenshots[0]
    this.firstStepComplete = true;


    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''))
  }

  async uploadFile() {
    this.uploadForm.disable()
    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMsg = 'Please Wait! While we sell your video on dark web ;)'
    this.inProgress = true
    this.showPercent = true

    const fileName = v4()
    const clipPath = `clips/${fileName}.mp4`
    const screenshotBlob = await this.ffmpegService.blobFromURL(this.selectedScreenshot)
    const screenshotPath = `screenshots/${fileName}.png`



    this.task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath)

    this.screenshotTask = this.storage.upload(screenshotPath, screenshotBlob)
    const screenshotRef = this.storage.ref(screenshotPath)

    combineLatest([this.task.percentageChanges(), this.screenshotTask.percentageChanges()]).subscribe(progress => {
      const [clipProgress, screenshotProgress] = progress
      if (!clipProgress || !screenshotProgress) {
        return
      }
      this.uploadProgress = clipProgress + screenshotProgress;
    })

    forkJoin([this.task.snapshotChanges(), this.screenshotTask.snapshotChanges()]).pipe(
      switchMap(() => forkJoin([clipRef.getDownloadURL(), screenshotRef.getDownloadURL()]))

    ).subscribe({
      next: async (urls) => {
        const [clipURL, screenshotURL] = urls
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value as string,
          fileName: `${fileName}.mp4` as string,
          url: clipURL as string,
          screenshotURL,
          screenshotFileName: `${fileName}.png`,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
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
