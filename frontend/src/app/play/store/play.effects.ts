import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
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
import { switchMap, map, catchError, tap, withLatestFrom } from 'rxjs/operators';

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
      this.soundEffects.playEffect('newRound');
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
      this.soundEffects.playEffect('explosion');
    })
  );

  @Effect()
  leaveGameEffect$ = this.actions$.pipe(
    ofType(playActions.leaveGame),
    map(() => {
      this.router.navigateByUrl('/home', { replaceUrl: true });
      this.soundEffects.stopMusic('clock');
      this.socketioService.stop();
      return playActions.loadResetGame();
    })
  );

  @Effect({
    dispatch: false
  })
  turnCheckedEffect$ = this.actions$.pipe(
    ofType(playActions.loadTurnChecked),
    withLatestFrom(this.startFacade.loggedPartecipant$),
    withLatestFrom(this.startFacade.currentRoomates$),
    tap(([[{ round, previousRound, response }, logged], roomates]) => {
      if (previousRound.currentPartecipantId !== logged.id) {
        const player = roomates.find(i => i.id === previousRound.currentPartecipantId);
        this.toaster.info(`${player.name} ${this.translate.instant('alerts.game.won')} '${response}!'`);
      }
      this.soundEffects.playEffect('turnCheck');
    })
  );

  @Effect({
    dispatch: false
  })
  turnWrongEffect$ = this.actions$.pipe(
    ofType(playActions.loadTurnWrong),
    withLatestFrom(this.startFacade.loggedPartecipant$),
    withLatestFrom(this.startFacade.currentRoomates$),
    tap(([[{ reason, round, response }, logged], roomates]) => {
      if (round.currentPartecipantId !== logged.id) {
        const player = roomates.find(i => i.id === round.currentPartecipantId);
        this.toaster.info(`${player.name} ${this.translate.instant('alerts.game.tried')} '${response}!'`);
      } else {
        this.soundEffects.playEffect('turnWrong');
        this.toaster.error(this.translate.instant(`reasons.${reason}`), this.translate.instant('alerts.game.wrong'))
      }
    })
  );

  @Effect({
    dispatch: false
  })
  goWaitingRoomEffect$ = this.actions$.pipe(
    ofType(playActions.goWaitingRoom),
    tap(() => {
      this.router.navigateByUrl('/waitingroom', { replaceUrl: true });
    })
  );

  @Effect({
    dispatch: false
  })
  recallWaitingRoomEffect$ = this.actions$.pipe(
    ofType(playActions.recallWaitingRoom),
    withLatestFrom(this.startFacade.currentRoom$),
    tap(([_, { id }]) => {
      this.socketioService.recallWaitingRoom(id);
    })
  );

  @Effect({
    dispatch: false
  })
  loadEndGameEffect$ = this.actions$.pipe(
    ofType(playActions.loadGameEnded),
    tap(() => {
      this.soundEffects.stopMusic('clock');
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
    private soundEffects: SoundEffectsService,
    private toaster: ToastrService,
    private translate: TranslateService
  ) { }

}