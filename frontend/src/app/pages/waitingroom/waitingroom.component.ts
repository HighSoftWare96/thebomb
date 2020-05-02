import { Partecipant } from '../../shared/interfaces/Partecipant';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RootFacadeService } from 'src/app/store/rootFacade.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Room } from 'src/app/shared/interfaces/Room';

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
    private rootFacade: RootFacadeService,
    private formBuilder: FormBuilder
  ) {
    this.roomates$ = rootFacade.currentRoomates$;
    this.currentPartecipant$ = rootFacade.loggedPartecipant$;
    this.room$ = rootFacade.currentRoom$;

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

}
