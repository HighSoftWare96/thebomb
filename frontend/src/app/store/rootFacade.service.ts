import { Partecipant } from './../shared/interfaces/Partecipant';
import * as rootActions from 'src/app/store/root.actions';
import * as rootSelectors from 'src/app/store/root.selectors';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Room } from '../shared/interfaces/Room';

@Injectable()
export class RootFacadeService {
  navigationLocked$: Observable<boolean>;
  loggedPartecipant$: Observable<Partecipant>;
  currentRoom$: Observable<Room>;
  currentRoomates$: Observable<Partecipant[]>;

  constructor(private store: Store<any>) {
    this.navigationLocked$ = this.store.select(rootSelectors.getLockedNavigation);
    this.loggedPartecipant$ = this.store.select(rootSelectors.getLoggedPartecipant);
    this.currentRoom$ = this.store.select(rootSelectors.getCurrentRoom);
    this.currentRoomates$ = this.store.select(rootSelectors.getRoomates);
  }

  resetStores() {
    this.store.dispatch(rootActions.loadResetStore());
  }

  getRouterParam(paramName): Observable<string> {
    return this.store.select(state => rootSelectors.getRouterParam(state, { paramName }))
  }

  getRouterQueryParam(paramName): Observable<string> {
    return this.store.select(state => rootSelectors.getRouterQueryParam(state, { paramName }));
  }

  unsetDirty() {
    this.store.dispatch(rootActions.loadUnsetDirty());
  }

  setNavigationLocked(locked: boolean = true) {
    this.store.dispatch(rootActions.loadSetLockedNavigation({ locked }));
  }

  refreshPartecipant() {
    this.store.dispatch(rootActions.loadRefreshPartecipant());
  }

  createPartecipant(name: string, avatarSeed: string) {
    this.store.dispatch(rootActions.loadTryCreatePartecipant({ name, avatarSeed }))
  }

  createRoom(room: Room) {
    this.store.dispatch(rootActions.loadCreateRoom({ room }));
  }

  registerNewRoomates(room: Room, partecipants: Partecipant[]) {
    this.store.dispatch(rootActions.loadNewRoomate({ room, partecipants }));
  }

  loadJoiningRoom() {
    this.store.dispatch(rootActions.loadJoiningRoom());
  }

  joinRoom(name: string, avatarSeed: string) {
    this.store.dispatch(rootActions.loadJoinRoom({ name, avatarSeed }))
  }

}
