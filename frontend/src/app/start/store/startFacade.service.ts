import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import * as startActions from './start.actions';
import * as startSelectors from './start.selectors';

import { Room } from 'src/app/shared/interfaces/Room';
import { Partecipant } from 'src/app/shared/interfaces/Partecipant';

@Injectable()
export class StartFacadeService {

  loggedPartecipant$: Observable<Partecipant>;
  currentRoom$: Observable<Room>;
  currentRoomates$: Observable<Partecipant[]>;

  constructor(
    private store: Store<any>
  ) {
    this.loggedPartecipant$ = this.store.select(startSelectors.getLoggedPartecipant);
    this.currentRoom$ = this.store.select(startSelectors.getCurrentRoom);
    this.currentRoomates$ = this.store.select(startSelectors.getRoomates);
  }

  refreshPartecipant() {
    this.store.dispatch(startActions.loadRefreshPartecipant());
  }

  createPartecipant(name: string, avatarSeed: string) {
    this.store.dispatch(startActions.loadTryCreatePartecipant({ name, avatarSeed }))
  }

  createRoom(room: Room) {
    this.store.dispatch(startActions.loadCreateRoom({ room }));
  }

  registerRoomatesChange(room: Room, partecipants: Partecipant[], updatedPartecipant: Partecipant, event: 'hasLeft' | 'hasJoined') {
    this.store.dispatch(startActions.loadRoomatesChanged({ room, partecipants, updatedPartecipant, event }));
  }

  loadJoiningRoom() {
    this.store.dispatch(startActions.loadJoiningRoom());
  }

  joinRoom(name: string, avatarSeed: string, inviteId?: string) {
    this.store.dispatch(startActions.loadJoinRoom({ name, avatarSeed, inviteId }))
  }
}