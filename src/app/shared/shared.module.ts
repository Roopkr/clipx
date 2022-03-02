import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { TabsComponent } from './tabs/tabs.component';
import { TabsContainerComponent } from './tabs-container/tabs-container.component';



@NgModule({
  declarations: [
    ModalComponent,
    TabsComponent,
    TabsContainerComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    ModalComponent,
    TabsComponent,
    TabsContainerComponent
  ]
})
export class SharedModule { }
