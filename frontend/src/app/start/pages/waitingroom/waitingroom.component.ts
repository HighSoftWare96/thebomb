import { PlayFacadeService } from 'src/app/play/store/playFacade.service';
import { Partecipant } from '../../../shared/interfaces/Partecipant';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Room } from 'src/app/shared/interfaces/Room';
import { StartFacadeService } from '../../store/startFacade.service';
import { GameApi } from 'src/app/shared/apis/game.service';
import { Router } from '@angular/router';
import { faClipboard, faCrown, faHandPointDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-waitingroom',
  templateUrl: './waitingroom.component.html',
  styleUrls: ['./waitingroom.component.scss']
})
export class WaitingRoomComponent implements OnInit, OnDestroy {
  faClipboard = faClipboard;
  faYou = faHandPointDown;
  faAdmin = faCrown;

  currentPartecipant$: Observable<Partecipant>;
  room$: Observable<Room>;
  roomates$: Observable<Partecipant[]>;

  form: FormGroup;
  subs: Subscription[] = [];
  languages = [{ label: 'it', value: 'it' }];
  difficulties = [
    { value: 0, label: 'facile' },
    { value: 1, label: 'normale' },
    { value: 2, label: 'difficile' },
    { value: 3, label: 'molto difficile' },
    { value: 4, label: 'pazzo!' }
  ];

  constructor(
    private startFacade: StartFacadeService,
    private formBuilder: FormBuilder,
    private playFacade: PlayFacadeService,
    private gameApi: GameApi,
    private router: Router
  ) {
    this.roomates$ = startFacade.currentRoomates$;
    this.currentPartecipant$ = startFacade.loggedPartecipant$;
    this.room$ = startFacade.currentRoom$;

    this.form = formBuilder.group({
      rounds: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      minTimeS: [30, [Validators.min(10), Validators.max(80)]],
      maxTimeS: [80, [Validators.min(20), Validators.max(180)]],
      language: ['it', [Validators.required]],
      difficulty: [1, [Validators.min(0), Validators.max(4), Validators.required]]
    }, {
      validators: [this.validateMinMax.bind(this)]
    });
  }

  validateMinMax(g: FormGroup) {
    const min = g.get('minTimeS').value;
    const max = g.get('maxTimeS').value;
    if (min && max && parseInt(min) >= parseInt(max)) {
      g.setErrors({ minGtMax: true })
    } else {
      g.setErrors(null);
    }
    return;
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
    const { origin } = window.location;
    return `${origin}/join/${room.inviteId}`;
  }

  newGame() {
    const { value } = this.form;
    this.playFacade.start(value);
  }

}
