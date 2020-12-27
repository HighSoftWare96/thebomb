import { Partecipant } from 'src/app/shared/interfaces/Partecipant';
import { SocketioService } from 'src/app/shared/apis/socketio.service';
import { GameState, GameStatus } from './play.reducer';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Game } from 'src/app/shared/interfaces/Game';
import * as playSelectors from './play.selectors';
import * as playActions from './play.actions';
import { Round } from 'src/app/shared/interfaces/Round';
import { GameStats } from 'src/app/shared/interfaces/GameStats';

@Injectable()
export class PlayFacadeService {
  isMyTurn$: Observable<boolean>;
  isExploded$: Observable<boolean>;
  currentGame$: Observable<Game>;
  currentStatus$: Observable<GameStatus>;
  currentRound$: Observable<Round>;
  gameResults$: Observable<GameStats>;
  isPlaying$: Observable<boolean>;
  currentPartecipant$: Observable<Partecipant>;

  constructor(
    private store: Store
  ) {
    this.currentGame$ = this.store.select(playSelectors.getCurrentGame);
    this.currentStatus$ = this.store.select(playSelectors.getStatus);
    this.currentRound$ = this.store.select(playSelectors.getCurrentRound);
    this.gameResults$ = this.store.select(playSelectors.getGameResult);
    this.isMyTurn$ = this.store.select(playSelectors.isMyTurn);
    this.isExploded$ = this.store.select(playSelectors.isExploded);
    this.isPlaying$ = this.store.select(playSelectors.isPlaying);
    this.currentPartecipant$ = this.store.select(playSelectors.currentPartecipant);
  }

  start(gameSettings: any) {
    this.store.dispatch(playActions.loadStartGame({ gameSettings }));
  }

  reset() {
    this.store.dispatch(playActions.loadResetGame());
  }

  sendResponse(response: string) {
    this.store.dispatch(playActions.loadSendResponse({ response }))
  }

  leaveGame() {
    this.store.dispatch(playActions.leaveGame());
  }

}