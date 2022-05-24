import { Injectable} from '@angular/core';

interface IModal {
  id: string,
  modalVisibility: boolean
}

@Injectable({
  providedIn: 'root'
})


export class ModalService {

  private modals: IModal[] = [];
  constructor() { }
 
  Register(id: string) {
    this.modals.push({
      id,
      modalVisibility: false
    })
    console.log(this.modals);
  }
  Unregister(id:string){
    this.modals = this.modals.filter(obj =>obj.id!==id)
  }
  isModalOpen(id: string) {
    let visibility = this.modals.find(obj => obj.id == id)?.modalVisibility;
    return !!visibility;
  }

  toggleModalVisibility(id: string) {
    
    let modal = this.modals.find(obj => obj.id == id);
    if (modal) {
      modal.modalVisibility = !modal?.modalVisibility;
    }
  }
}
