import { CustomRouterState, RootState } from './root.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const getRouterFeature = createFeatureSelector<{ state: CustomRouterState }>('router');
export const getRouterStateData = createSelector(
    getRouterFeature,
    // the routerReducer of the @ngrx/router-store serializes everything in
    // the state field of the router reducer state
    (routerState) => routerState && routerState.state
);

export const getRouterParam = createSelector(
    getRouterStateData,
    (state: CustomRouterState, { paramName }) => {
        return state && state.params[paramName] ? state.params[paramName] : '';
    }
);

export const getRouterQueryParam = createSelector(
    getRouterStateData,
    (state: CustomRouterState, { paramName }) => state && state.queryParams[paramName]
);

export const getRouterUrl = createSelector(
    getRouterStateData,
    (state: CustomRouterState) => state && state.url
);

export const getRootFeature = createFeatureSelector('root');

export const getLockedNavigation = createSelector(
    getRootFeature,
    (state: RootState) => state ? state.navigationLocked : false
);
