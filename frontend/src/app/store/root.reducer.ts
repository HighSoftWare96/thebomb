import { Params } from '@angular/router';
import { routerReducer } from '@ngrx/router-store';
import { createReducer, MetaReducer } from '@ngrx/store';
import { getRouterParam, getRouterQueryParam, getRouterUrl } from 'src/app/store/root.selectors';
import { environment } from 'src/environments/environment';


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
