import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';
@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  sortingOrder = '1'
  clips: IClip[] = []
  activeClip: IClip | null = null
  sort$ : BehaviorSubject<string>

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modal: ModalService
  ) { 
    this.sort$ = new BehaviorSubject(this.sortingOrder)
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.sortingOrder = params.sort === '2' ? params.sort : '1'
      this.sort$.next(this.sortingOrder)
    })

    this.clipService.getUserClip(this.sort$).subscribe(docs => {
      this.clips = []

      docs.forEach(element => {
        this.clips.push({
          documentID: element.id,
          ...element.data()
        })
      });
    })
  }

  sort(event: Event) {
    const { value } = (event.target as HTMLSelectElement)
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value
      }
    })
  }

  openModal($event: Event, clip: IClip) {
    $event.preventDefault()
    this.activeClip = clip
    this.modal.toggleModalVisibility('editClip')

  }

  updateComponent($event: IClip) {
    this.clips.forEach((item, index) => {
      if (item.documentID == $event.documentID) {
        this.clips[index].title = $event.title
      }
    })

  }

  deleteClip($event: Event, clip: IClip) {
    $event.preventDefault()

    this.clipService.deleteClip(clip)

    this.clips.forEach((item, index) => {
      if (clip.documentID == clip.documentID) {
        this.clips.splice(index, 1)
      }
    })
  }

}
