import { RoomApi } from './../shared/apis/room.service';
import { PartecipantApi } from './../shared/apis/partecipant.service';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as rootActions from './root.actions';
import { switchMap, map, catchError, tap, withLatestFrom, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { BearerInterceptor } from '../common/interceptors/bearer.interceptor';
import { RootFacadeService } from './rootFacade.service';
import { Router } from '@angular/router';
import { SocketioService } from '../shared/apis/socketio.service';

@Injectable()
export class RootEffects {

  constructor(
    private action$: Actions,
    private partecipantApi: PartecipantApi,
    private bearerInterceptor: BearerInterceptor,
    private rootFacade: RootFacadeService,
    private router: Router,
    private roomApi: RoomApi,
    private socketIo: SocketioService
  ) { }

  // refresh partecipant
  @Effect()
  loadRefreshPartecipantEffect$ = this.action$.pipe(
    ofType(rootActions.loadRefreshPartecipant),
    switchMap(() => this.partecipantApi.refresh().pipe(
      map(({ partecipant, jwt }) => rootActions.loadRefreshPartecipantSuccess({ partecipant, jwt })),
      catchError(error => of(rootActions.loadRefreshPartecipantFailure({ error })))
    ))
  )

  @Effect({
    dispatch: false
  })
  loadRefreshPartecipantSuccessEffect$ = this.action$.pipe(
    ofType(rootActions.loadRefreshPartecipantSuccess),
    tap(({ partecipant, jwt }) => {
      this.bearerInterceptor.setJwt(jwt);
    })
  )

  // create partecipant
  @Effect()
  loadCreatePartecipantEffect$ = this.action$.pipe(
    ofType(rootActions.loadTryCreatePartecipant),
    withLatestFrom(this.rootFacade.loggedPartecipant$),
    switchMap(([{ avatarSeed, name }, partecipant]) => {
      if (partecipant) {
        // recupero il partecipante attuale
        return of(
          rootActions.loadTryCreatePartecipantSuccess({
            partecipant,
            jwt: this.bearerInterceptor.getJwt()
          })
        );
      }
      return this.partecipantApi.create({
        avatarSeed,
        name
      }).pipe(
        map(({ partecipant, jwt }) => rootActions.loadTryCreatePartecipantSuccess({ partecipant, jwt })),
        catchError(error => of(rootActions.loadTryCreatePartecipantFailure({ error })))
      );
    })
  )

  @Effect({
    dispatch: false
  })
  loadCreatePartecipantSuccessEffect$ = this.action$.pipe(
    ofType(rootActions.loadTryCreatePartecipantSuccess),
    tap(({ partecipant, jwt }) => {
      this.bearerInterceptor.setJwt(jwt);
      this.router.navigateByUrl('/rooms/new');
    })
  )

  // create room, join and connect
  @Effect()
  loadCreateRoomEffect$ = this.action$.pipe(
    ofType(rootActions.loadCreateRoom),
    switchMap(({ room }) => {
      return this.roomApi.create({
        ...room
      }).pipe(
        concatMap((room) => this.roomApi.join(room.inviteId).pipe(
          concatMap((updatedRoom) => this.socketIo.initialize(updatedRoom.socketioRoom).pipe(
            map((lastRoom) => rootActions.loadCreateRoomSuccess({ room: lastRoom })),
            catchError(error => of(rootActions.loadCreateRoomFailure({ error })))
          ))
        )),
        catchError(error => of(rootActions.loadCreateRoomFailure({ error })))
      );
    })
  )

  @Effect({
    dispatch: false
  })
  loadCreateRoomSuccessEffect$ = this.action$.pipe(
    ofType(rootActions.loadCreateRoomSuccess),
    tap(({ room }) => {
      this.router.navigateByUrl('/waitingroom');
    })
  )

  // load joining room
  @Effect()
  loadLoadJoiningRoomEffect$ = this.action$.pipe(
    ofType(rootActions.loadJoiningRoom),
    withLatestFrom(this.rootFacade.getRouterParam('inviteId')),
    switchMap(([_, inviteId]) => {
      return this.roomApi.getByInviteId(inviteId).pipe(
        map((room) => rootActions.loadJoiningRoomSuccess({ room })),
        catchError(error => of(rootActions.loadJoiningRoomFailure({ error })))
      );
    })
  )

  // join room
  @Effect()
  loadJoinRoomEffect$ = this.action$.pipe(
    ofType(rootActions.loadJoinRoom),
    withLatestFrom(this.rootFacade.getRouterParam('inviteId')),
    withLatestFrom(this.rootFacade.loggedPartecipant$),
    switchMap(([[{ avatarSeed, name }, inviteId], loggedPartecipant]) => {
      let resultObs;

      if (loggedPartecipant) {
        resultObs = of({
          partecipant: loggedPartecipant,
          jwt: this.bearerInterceptor.getJwt()
        });
      } else {
        resultObs = this.partecipantApi.create({
          avatarSeed,
          name
        });
      }

      return resultObs.pipe(
        concatMap(({ partecipant, jwt }) => {
          this.bearerInterceptor.setJwt(jwt);
          return this.roomApi.join(inviteId).pipe(
            concatMap((updatedRoom) => this.socketIo.initialize(updatedRoom.socketioRoom).pipe(
              map((room) => rootActions.loadJoinRoomSuccess({ room, partecipant })),
              catchError((error) => of(rootActions.loadJoinRoomFailure({ error })))
            )),
            catchError((error) => of(rootActions.loadJoinRoomFailure({ error })))
          )
        })
      );
    })
  )

  @Effect({
    dispatch: false
  })
  loadJoinRoomSuccessSuccessEffect$ = this.action$.pipe(
    ofType(rootActions.loadJoinRoomSuccess),
    tap(({ partecipant, room }) => {
      this.router.navigateByUrl('/waitingroom');
    })
  )

}
