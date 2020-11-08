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
    withLatestFrom(this.rootFacade.getRouterState()),
    withLatestFrom(this.startFacade.currentRoom$),
    switchMap(([[_, routerState], currentRoom]) => {
      const { queryParams } = routerState;
      return this.gameApi.start({
        difficulty: queryParams.difficulty,
        language: queryParams.language,
        maxTimeS: queryParams.maxTimeS,
        minTimeS: queryParams.minTimeS,
        roomId: currentRoom.id,
        rounds: queryParams.rounds
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
    tap(() => {
      this.router.navigateByUrl('play/game');
    })
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
    }))



  constructor(
    private actions$: Actions,
    private rootFacade: RootFacadeService,
    private gameApi: GameApi,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private startFacade: StartFacadeService,
    private socketioService: SocketioService,
    private playFacade: PlayFacadeService
  ) { }

}