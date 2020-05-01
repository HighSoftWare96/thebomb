import { Partecipant } from './../../shared/interfaces/Partecipant';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { RootFacadeService } from 'src/app/store/rootFacade.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loggedPartecipant$: Observable<Partecipant>;

  constructor(
    private rootFacade: RootFacadeService
  ) {
    this.loggedPartecipant$ = rootFacade.loggedPartecipant$;
  }

  ngOnInit(): void { }
}
