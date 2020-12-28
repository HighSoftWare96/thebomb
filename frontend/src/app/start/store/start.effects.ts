import { ToastrService } from 'ngx-toastr';
import { StartFacadeService } from './startFacade.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { PartecipantApi } from 'src/app/shared/apis/partecipant.service';
import { BearerInterceptor } from 'src/app/common/interceptors/bearer.interceptor';
import { RootFacadeService } from 'src/app/store/rootFacade.service';
import { Router } from '@angular/router';
import { RoomApi } from 'src/app/shared/apis/room.service';
import { SocketioService } from 'src/app/shared/apis/socketio.service';
import { switchMap, map, catchError, tap, withLatestFrom, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import * as startActions from './start.actions';

@Injectable()
export class StartEffects {

  constructor(
    private action$: Actions,
    private partecipantApi: PartecipantApi,
    private bearerInterceptor: BearerInterceptor,
    private startFacade: StartFacadeService,
    private router: Router,
    private roomApi: RoomApi,
    private socketIo: SocketioService,
    private rootFacade: RootFacadeService,
    private toaster: ToastrService
  ) { }

  // refresh partecipant
  @Effect()
  loadRefreshPartecipantEffect$ = this.action$.pipe(
    ofType(startActions.loadRefreshPartecipant),
    switchMap(() => this.partecipantApi.refresh().pipe(
      map(({ partecipant, jwt }) => startActions.loadRefreshPartecipantSuccess({ partecipant, jwt })),
      catchError(error => of(startActions.loadRefreshPartecipantFailure({ error })))
    ))
  )

  @Effect({
    dispatch: false
  })
  loadRefreshPartecipantSuccessEffect$ = this.action$.pipe(
    ofType(startActions.loadRefreshPartecipantSuccess),
    tap(({ partecipant, jwt }) => {
      this.bearerInterceptor.setJwt(jwt);
    })
  )

  // create partecipant
  @Effect()
  loadCreatePartecipantEffect$ = this.action$.pipe(
    ofType(startActions.loadTryCreatePartecipant),
    withLatestFrom(this.startFacade.loggedPartecipant$),
    switchMap(([{ avatarSeed, name }, partecipant]) => {
      let opObs = this.partecipantApi.create({
        avatarSeed,
        name
      });

      if (partecipant) {
        // recupero il partecipante attuale
        opObs = this.partecipantApi.update({
          avatarSeed,
          name,
          id: partecipant.id
        }).pipe(
          map((partecipant) => ({ partecipant, jwt: this.bearerInterceptor.getJwt() }))
        );
      }
      return opObs.pipe(
        map(({ partecipant, jwt }) => startActions.loadTryCreatePartecipantSuccess({ partecipant, jwt })),
        catchError(error => of(startActions.loadTryCreatePartecipantFailure({ error })))
      );
    })
  )

  @Effect({
    dispatch: false
  })
  loadCreatePartecipantSuccessEffect$ = this.action$.pipe(
    ofType(startActions.loadTryCreatePartecipantSuccess),
    tap(({ partecipant, jwt }) => {
      this.bearerInterceptor.setJwt(jwt);
      this.router.navigateByUrl('/rooms/new', { replaceUrl: true });
    })
  )

  // create room, join and connect
  @Effect()
  loadCreateRoomEffect$ = this.action$.pipe(
    ofType(startActions.loadCreateRoom),
    switchMap(({ room }) => {
      return this.roomApi.create({
        ...room
      }).pipe(
        concatMap((room) => this.roomApi.join(room.inviteId).pipe(
          concatMap((updatedRoom) => this.socketIo.initialize(updatedRoom.socketioRoom).pipe(
            map((lastRoom) => startActions.loadCreateRoomSuccess({ room: lastRoom })),
            catchError(error => of(startActions.loadCreateRoomFailure({ error })))
          ))
        )),
        catchError(error => of(startActions.loadCreateRoomFailure({ error })))
      );
    })
  )

  @Effect({
    dispatch: false
  })
  loadCreateRoomSuccessEffect$ = this.action$.pipe(
    ofType(startActions.loadCreateRoomSuccess),
    tap(({ room }) => {
      this.router.navigateByUrl('/waitingroom', { replaceUrl: true });
    })
  )

  // load joining room
  @Effect()
  loadLoadJoiningRoomEffect$ = this.action$.pipe(
    ofType(startActions.loadJoiningRoom),
    withLatestFrom(this.rootFacade.getRouterParam('inviteId')),
    switchMap(([_, inviteId]) => {
      if (!inviteId) {
        return of(startActions.loadJoiningRoomSuccess({}));
      }
      return this.roomApi.getByInviteId(inviteId).pipe(
        map((room) => startActions.loadJoiningRoomSuccess({ room })),
        catchError(error => of(startActions.loadJoiningRoomFailure({ error })))
      );
    })
  )

  @Effect({
    dispatch: false
  })
  loadJoiningRoomFailureEffect$ = this.action$.pipe(
    ofType(startActions.loadJoiningRoomFailure),
    tap(() => {
      this.toaster.error('Impossibile trovare la stanza selezionata', 'Stanza non trovata!');
    })
  )

  // join room
  @Effect()
  loadJoinRoomEffect$ = this.action$.pipe(
    ofType(startActions.loadJoinRoom),
    withLatestFrom(this.rootFacade.getRouterParam('inviteId')),
    withLatestFrom(this.startFacade.loggedPartecipant$),
    switchMap(([[{ avatarSeed, name, inviteId: inviteIdForm }, inviteIdQuery], loggedPartecipant]) => {
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
          return this.roomApi.join(inviteIdForm || inviteIdQuery).pipe(
            concatMap((updatedRoom) => this.socketIo.initialize(updatedRoom.socketioRoom).pipe(
              map((room) => startActions.loadJoinRoomSuccess({ room, partecipant })),
              catchError((error) => of(startActions.loadJoinRoomFailure({ error })))
            )),
            catchError((error) => of(startActions.loadJoinRoomFailure({ error })))
          )
        })
      );
    })
  )

  @Effect({
    dispatch: false
  })
  loadJoinRoomSuccessSuccessEffect$ = this.action$.pipe(
    ofType(startActions.loadJoinRoomSuccess),
    tap(({ partecipant, room }) => {
      this.router.navigateByUrl('/waitingroom', { replaceUrl: true });
    })
  )

  @Effect({
    dispatch: false
  })
  loadGameStartedEffect$ = this.action$.pipe(
    ofType(startActions.loadGameStarted),
    tap(() => {
      this.router.navigateByUrl('play/game', { replaceUrl: true });
    })
  )

  @Effect({
    dispatch: false
  })
  loadRoomateChangeEffect$ = this.action$.pipe(
    ofType(startActions.loadRoomatesChanged),
    withLatestFrom(this.startFacade.loggedPartecipant$),
    withLatestFrom(this.startFacade.currentRoomates$),
    tap(([[{ partecipants, updatedPartecipant, event }, loggedUser], roomates]) => {
      if (updatedPartecipant.id === loggedUser.id) {
        return;
      }
      if (event === 'hasJoined') {
        this.toaster.success(`È arrivato: ${updatedPartecipant.name}!`, 'Nuovo giocatore!');
      }
      if (event === 'hasLeft') {
        this.toaster.warning(`Il giocatore ${updatedPartecipant.name} ha abbandonato!`, 'Giocatore uscito!');
      }
    })
  )

  @Effect({
    dispatch: false
  })
  loadLeaveRoomEffect$ = this.action$.pipe(
    ofType(startActions.loadLeaveRoom),
    tap(() => {
      this.socketIo.stop();
    })
  )

}
