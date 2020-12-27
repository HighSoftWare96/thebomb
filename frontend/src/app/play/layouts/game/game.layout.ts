import { StartFacadeService } from 'src/app/start/store/startFacade.service';
import { Partecipant } from 'src/app/shared/interfaces/Partecipant';
import { Game } from 'src/app/shared/interfaces/Game';
import { Round } from 'src/app/shared/interfaces/Round';
import LockableComponent from 'src/app/shared/interfaces/LockableComponent';
import { HostListener } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlayFacadeService } from 'src/app/play/store/playFacade.service';

@Component({
  selector: 'app-game-layout',
  templateUrl: './game.layout.html',
  styleUrls: ['./game.layout.scss']
})
export class GameLayoutComponent implements OnInit, OnDestroy, LockableComponent {

  isMyTurn$: Observable<boolean>;
  playing$: Observable<boolean>;
  isExploded$: Observable<boolean>;
  currentRound$: Observable<Round>;
  currentGame$: Observable<Game>;
  currentPlayer$: Observable<Partecipant>;
  roomates$: Observable<Partecipant[]>;
  loggedPlayer$: Observable<Partecipant>;

  allowRedirect: boolean;
  subs: Array<Subscription> = [];

  canDeactivate(): boolean {
    return this.allowRedirect;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander() {
    // or directly false
    return this.allowRedirect;
  }

  onLeaving() {
    this.playFacade.leaveGame();
  }


  constructor(
    private playFacade: PlayFacadeService,
    private startFacade: StartFacadeService
  ) {
    this.isMyTurn$ = playFacade.isMyTurn$;
    this.isExploded$ = playFacade.isExploded$;
    this.currentRound$ = playFacade.currentRound$;
    this.currentGame$ = playFacade.currentGame$;
    this.currentPlayer$ = playFacade.currentPartecipant$;
    this.roomates$ = startFacade.currentRoomates$;
    this.playing$ = playFacade.isPlaying$;
    this.loggedPlayer$ = startFacade.loggedPartecipant$;
    this.subs.push(
      this.playFacade.currentStatus$.subscribe(s => {
        this.allowRedirect = (s === 'END');
      })
    );
  }

  ngOnInit(): void { }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
}
