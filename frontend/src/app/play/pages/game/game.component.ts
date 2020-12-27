import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Game } from 'src/app/shared/interfaces/Game';
import { GameStats } from 'src/app/shared/interfaces/GameStats';
import { Room } from 'src/app/shared/interfaces/Room';
import { Round } from 'src/app/shared/interfaces/Round';
import { StartFacadeService } from 'src/app/start/store/startFacade.service';
import { GameStatus } from '../../store/play.reducer';
import { PlayFacadeService } from '../../store/playFacade.service';
import { Partecipant } from './../../../shared/interfaces/Partecipant';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  currentGame$: Observable<Game>;
  currentRound$: Observable<Round>;
  status$: Observable<GameStatus>;
  stats$: Observable<GameStats>;
  currentPartecipant$: Observable<Partecipant>;
  roomates$: Observable<Partecipant[]>;
  currentRoom$: Observable<Room>;

  form: FormGroup;

  constructor(
    private playFacade: PlayFacadeService,
    private formBuilder: FormBuilder,
    private startFacade: StartFacadeService
  ) {
    this.currentGame$ = this.playFacade.currentGame$;
    this.currentRound$ = this.playFacade.currentRound$;
    this.status$ = this.playFacade.currentStatus$;
    this.stats$ = this.playFacade.gameResults$;
    this.currentPartecipant$ = this.startFacade.loggedPartecipant$;
    this.roomates$ = this.startFacade.currentRoomates$;
    this.currentRoom$ = this.startFacade.currentRoom$;
    this.form = this.formBuilder.group({
      response: ['', [Validators.required]]
    });

  }

  ngOnInit(): void {
  }

  getRoomate(roomates: Partecipant[], partecipantId: number): Partecipant {
    return roomates.find(r => r.id === partecipantId);
  }

  sendResponse() {
    const { response } = this.form.value;
    this.playFacade.sendResponse(response);
    this.form.get('response').setValue('');
  }

  recallWaitingRoom() {
    this.playFacade.recallWaitingRoom();
  }

  backHome() {
    this.playFacade.leaveGame();
  }

}
