import { SoundEffectsService } from './../../common/services/soundEffects.service';
import { PlayFacadeService } from './playFacade.service';
import { SocketioService } from 'src/app/shared/apis/socketio.service';
import { StartFacadeService } from './../../start/store/startFacade.service';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as playActions from './play.actions';
import { RootFacadeService } from 'src/app/store/rootFacade.service';
import { GameApi } from 'src/app/shared/apis/game.service';
import { Router, ActivatedRoute } from '@angular/router';
import { withLatestFrom, switchMap, map, catchError, tap } from 'rxjs/operators';

@Injectable()
export class PlayEffects {

  @Effect()
  loadStartGame$ = this.actions$.pipe(
    ofType(playActions.loadStartGame),
    withLatestFrom(this.startFacade.currentRoom$),
    switchMap(([{ gameSettings }, currentRoom]) => {
      return this.gameApi.start({
        difficulty: gameSettings.difficulty,
        language: gameSettings.language,
        maxTimeS: gameSettings.maxTimeS,
        minTimeS: gameSettings.minTimeS,
        roomId: currentRoom.id,
        rounds: gameSettings.rounds
      }).pipe(
        map((game) => playActions.loadStartGameSuccess({ game })),
        catchError((error) => of(playActions.loadStartGameFailure({ error })))
      );
    })
  );

  @Effect({
    dispatch: false
  })
  loadStartGameSuccess$ = this.actions$.pipe(
    ofType(playActions.loadStartGameSuccess),
    tap(() => { })
  );

  @Effect({
    dispatch: false
  })
  loadSendResponseEffect$ = this.actions$.pipe(
    ofType(playActions.loadSendResponse),
    withLatestFrom(this.playFacade.currentRound$),
    withLatestFrom(this.startFacade.loggedPartecipant$),
    tap(([[{ response }, currentRound], partecipant]) => {
      this.socketioService.checkTurn(partecipant.id, currentRound.id, response);
    })
  );

  @Effect({
    dispatch: false
  })
  loadRoundStarted$ = this.actions$.pipe(
    ofType(playActions.loadRoundStarted),
    tap(() => {
      this.soundEffects.playMusic('clock');
    })
  );


  @Effect({
    dispatch: false
  })
  loadRoundEnded$ = this.actions$.pipe(
    ofType(playActions.loadRoundEnded),
    tap(() => {
      this.soundEffects.stopMusic('clock');
    })
  );

  @Effect()
  leaveGameEffect$ = this.actions$.pipe(
    ofType(playActions.leaveGame),
    map(() => {
      this.soundEffects.stopMusic('clock');
      this.socketioService.stop();
      return playActions.loadResetGame();
    })
  );

  constructor(
    private actions$: Actions,
    private rootFacade: RootFacadeService,
    private gameApi: GameApi,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private startFacade: StartFacadeService,
    private socketioService: SocketioService,
    private playFacade: PlayFacadeService,
    private soundEffects: SoundEffectsService
  ) { }

}