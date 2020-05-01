import { Component, OnInit } from '@angular/core';
import { RootFacadeService } from './store/rootFacade.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private rootFacade: RootFacadeService
  ) { }

  ngOnInit() {
    this.rootFacade.refreshPartecipant();
  }

}
