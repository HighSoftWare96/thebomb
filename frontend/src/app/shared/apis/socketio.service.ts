import { RootFacadeService } from 'src/app/store/rootFacade.service';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { BearerInterceptor } from 'src/app/common/interceptors/bearer.interceptor';
import { Observable } from 'rxjs';
import { Room } from '../interfaces/Room';

@Injectable()
export class SocketioService {
  ioClient;

  constructor(
    private bearerInterceptor: BearerInterceptor,
    private rootFacade: RootFacadeService
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

  private registerListeners() {
    this.ioClient.on('new-roomate', ({ room, partecipants }) => {
      this.rootFacade.registerNewRoomates(room, partecipants);
    });
  }

  //   ioClient.on('room-joined', (payload) => {
  //     console.log('⛺️Joined room!', payload);
  //   });

  // ioClient.on('new-roomate', (payload) => {
  //   console.log('🙇🏻‍♂️New partecipant!', payload);
  // });

  // ioClient.on('game-started', (payload) => {
  //   console.log('Gioco partito!', payload);
  // });

  // ioClient.on('game-ended', (payload) => {
  //   console.log('Gioco finito!', payload);
  // });

  // ioClient.on('round-started', (payload) => {
  //   console.log('Round partito!', payload);
  //   ioClient.emit('turn-check', {
  //     partecipantId: 1,
  //     roundId: payload.round.id,
  //     response: 'aereo'
  //   });
  // });

  // ioClient.on('turn-checked', (payload) => {
  //   console.log('Check ok. NEXT.', payload);
  // });

  // ioClient.on('turn-wrong', (error) => {
  //   console.log('Turno errato', error);
  // });

  // ioClient.on('round-ended', (payload) => {
  //   console.log('Round finito!', payload);
  // });

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