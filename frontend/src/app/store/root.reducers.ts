import { ActionReducerMap, MetaReducer, ReducerManager, createReducer, on } from '@ngrx/store';
import { RouterReducerState, routerReducer } from '@ngrx/router-store';
import {
  getRouterParam,
  getRouterQueryParam,
  getRouterUrl
} from 'src/app/store/root.selectors';
import { loadSetLockedNavigation } from './root.actions';

import { Params } from '@angular/router';
import { environment } from 'src/environments/environment';

export interface CustomRouterState {
  url: string;
  queryParams: Params;
  params: Params;
}

export interface RootState {
  navigationLocked: boolean;
}

const initialBreadcrumbState: RootState = {
  navigationLocked: false
};

const rootReducerFun = createReducer(initialBreadcrumbState);

export function rootReducer(state, action) {
  return rootReducerFun(state, action);
}

export const reducers = {
  router: routerReducer,
  root: rootReducer
};


export const metaReducers: MetaReducer[] =
  !environment.production ? [] : [];

export const routerSelectors = {
  getRouterParam,
  getRouterQueryParam,
  getRouterUrl
};
