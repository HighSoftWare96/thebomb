import { ActionReducerMap, MetaReducer, ReducerManager, createReducer, on } from '@ngrx/store';
import { RouterReducerState, routerReducer } from '@ngrx/router-store';
import {
  getRouterParam,
  getRouterQueryParam,
  getRouterUrl
} from 'src/app/store/root.selectors';

import { Params } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Partecipant } from '../shared/interfaces/Partecipant';
import * as rootActions from './root.actions';

export interface CustomRouterState {
  url: string;
  queryParams: Params;
  params: Params;
}

export interface RootState {
  navigationLocked: boolean;
}

const initialRootState: RootState = {
  navigationLocked: false
};

const rootReducerFun = createReducer(initialRootState);

export function rootReducer(state, action) {
  return rootReducerFun(state, action);
}


export interface AuthState {
  partecipant: Partecipant;
}

const initialAuthState: AuthState = {
  partecipant: null
};

const authReducerFun = createReducer(initialAuthState,
  on(rootActions.loadRefreshPartecipantSuccess, (state, { partecipant }) => ({
    ...state,
    partecipant
  }))
);

export function authReducer(state, action) {
  return authReducerFun(state, action);
}

export const reducers = {
  router: routerReducer,
  root: rootReducer,
  auth: authReducer
};


export const metaReducers: MetaReducer[] =
  !environment.production ? [] : [];

export const routerSelectors = {
  getRouterParam,
  getRouterQueryParam,
  getRouterUrl
};
