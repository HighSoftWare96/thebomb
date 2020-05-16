import { Partecipant } from '../../../shared/interfaces/Partecipant';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RootFacadeService } from 'src/app/store/rootFacade.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Room } from 'src/app/shared/interfaces/Room';
import { StartFacadeService } from '../../store/startFacade.service';
import { GameApi } from 'src/app/shared/apis/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-waitingroom',
  templateUrl: './waitingroom.component.html',
  styleUrls: ['./waitingroom.component.scss']
})
export class WaitingRoomComponent implements OnInit, OnDestroy {

  currentPartecipant$: Observable<Partecipant>;
  room$: Observable<Room>;
  roomates$: Observable<Partecipant[]>;

  form: FormGroup;
  subs: Subscription[] = [];
  languages = ['it'];
  difficulties = [0, 1, 2, 3, 4];

  constructor(
    private startFacade: StartFacadeService,
    private formBuilder: FormBuilder,
    private gameApi: GameApi,
    private router: Router
  ) {
    this.roomates$ = startFacade.currentRoomates$;
    this.currentPartecipant$ = startFacade.loggedPartecipant$;
    this.room$ = startFacade.currentRoom$;

    this.form = formBuilder.group({
      rounds: [5],
      minTimeS: [30],
      maxTimeS: [80],
      language: ['it'],
      difficulty: [1]
    });
  }

  ngOnInit(): void { }

  ngOnDestroy() {
    this.subs.forEach(s => {
      if (s) {
        s.unsubscribe();
      }
    });
  }

  copyLink(link: string) {
    navigator.clipboard.writeText(link).then(() => { });
  }

  getLink(room: Room): string {
    if (!room || !room.inviteId) {
      return undefined;
    }
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}/join/${room.inviteId}`;
  }

  newGame() {
    const { value } = this.form;
    this.router.navigate(
      ['play', 'game'],
      { queryParams: value }
    );
  }

}
