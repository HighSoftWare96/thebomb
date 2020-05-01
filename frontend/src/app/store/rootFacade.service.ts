import { Partecipant } from './../shared/interfaces/Partecipant';
import * as rootActions from 'src/app/store/root.actions';
import * as rootSelectors from 'src/app/store/root.selectors';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable()
export class RootFacadeService {
  navigationLocked$: Observable<boolean>;
  loggedPartecipant$: Observable<Partecipant>;

  constructor(private store: Store<any>) {
    this.navigationLocked$ = this.store.select(rootSelectors.getLockedNavigation);
    this.loggedPartecipant$ = this.store.select(rootSelectors.getLoggedPartecipant);
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

}
