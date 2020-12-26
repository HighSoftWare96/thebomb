import { events } from './../interfaces/socketioEvents';
import { RootFacadeService } from 'src/app/store/rootFacade.service';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { BearerInterceptor } from 'src/app/common/interceptors/bearer.interceptor';
import { Observable } from 'rxjs';
import { Room } from '../interfaces/Room';
import { StartFacadeService } from 'src/app/start/store/startFacade.service';
import { Store } from '@ngrx/store';
import * as playActions from '../../play/store/play.actions';
import * as startActions from '../../start/store/start.actions';

@Injectable()
export class SocketioService {
  private ioClient;

  constructor(
    private bearerInterceptor: BearerInterceptor,
    private startFacade: StartFacadeService,
    private store: Store<any>
  ) { }

  initialize(socketioRoom: string): Observable<Room> {
    return new Observable((obs) => {
      this.ioClient = io.connect(environment.socketioBase, {
        transports: ['websocket', 'polling'],
        query: {
          socketioRoom,
          accessToken: this.bearerInterceptor.getJwt()
        }
      });
      this.ioClient.on('room-joined', ({ room }) => {
        obs.next(room);
      });
      this.ioClient.on('disconnect', (err) => {
        obs.error(err);
      });
      this.registerListeners();
    });
  }

  stop() {
    this.ioClient.disconnect();
    this.ioClient = undefined;
  }

  checkTurn(partecipantId: number, roundId: number, response: string) {
    this.ioClient.emit(events.fromClient.turnCheck, {
      partecipantId,
      roundId,
      response
    });
  }

  private registerListeners() {
    this.ioClient.on(events.fromServer.newRoomate, ({ room, partecipants }) => {
      this.startFacade.registerRoomatesChange(room, partecipants);
    });
    this.ioClient.on(events.fromServer.roomateLeft, ({ room, partecipants }) => {
      this.startFacade.registerRoomatesChange(room, partecipants);
    });
    this.ioClient.on(events.fromServer.gameStarted, ({ game }) => {
      this.store.dispatch(startActions.loadGameStarted({ game }));
    });
    this.ioClient.on(events.fromServer.gameEnded, ({ game, statistics }) => {
      this.store.dispatch(playActions.loadGameEnded({ game, statistics }));
    });
    this.ioClient.on(events.fromServer.roundStarted, ({ round }) => {
      this.store.dispatch(playActions.loadRoundStarted({ round }));
    });
    this.ioClient.on(events.fromServer.turnChecked, ({ round }) => {
      this.store.dispatch(playActions.loadTurnChecked({ round }));
    });
    this.ioClient.on(events.fromServer.turnWrong, ({ round }) => {
      this.store.dispatch(playActions.loadTurnWrong({ round }));
    });
    this.ioClient.on(events.fromServer.roundEnded, ({ round }) => {
      this.store.dispatch(playActions.loadRoundEnded({ round }));
    });
  }

  // ioClient.on('error', (error) => {
  //   console.log('System error', error);
  // });

  // ioClient.on('client-error', (error) => {
  //   console.log('Client error', error);
  // });

  // ioClient.on('server-error', (error) => {
  //   console.log('Server error', error);
  // });

}