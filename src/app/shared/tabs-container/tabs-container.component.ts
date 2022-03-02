import { AfterContentInit, Component, ContentChildren, QueryList } from '@angular/core';
import { TabsComponent } from '../tabs/tabs.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.scss']
})
export class TabsContainerComponent implements AfterContentInit{

  @ContentChildren(TabsComponent) tabs? : QueryList<TabsComponent>;
  constructor() { }

  ngAfterContentInit(): void {
      const activeTabs = this.tabs?.filter(item => item.active);
      
      if(!activeTabs || activeTabs.length === 0){
        this.selectTab(this.tabs!.first)
      }
  }

  selectTab(tab:TabsComponent){
    this.tabs?.forEach(item => item.active = false);
    tab.active = !tab.active;
    return false;
  }
}
