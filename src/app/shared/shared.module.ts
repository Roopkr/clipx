import { Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { TabsComponent } from './tabs/tabs.component';
import { TabsContainerComponent } from './tabs-container/tabs-container.component';
import { InputComponent } from './input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './alert/alert.component';
import { EventBlockerDirective } from './directives/event-blocker.directive';



@NgModule({
  declarations: [
    ModalComponent,
    TabsComponent,
    TabsContainerComponent,
    InputComponent,
    AlertComponent,
    EventBlockerDirective
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports:[
    ModalComponent,
    TabsComponent,
    TabsContainerComponent,
    InputComponent,
    AlertComponent,
    EventBlockerDirective
  ]
})
export class SharedModule { }
