import { StartState } from './start.reducer';
import { createSelector, createFeatureSelector } from '@ngrx/store';

export const getStartFeature = createFeatureSelector('start');

export const getLoggedPartecipant = createSelector(
  getStartFeature,
  (state: StartState) => state ? state.partecipant : undefined
);

export const getCurrentRoom = createSelector(
  getStartFeature,
  (state: StartState) => state ? state.room : undefined
);

export const getRoomates = createSelector(
  getStartFeature,
  (state: StartState) => state ? state.roomates : []
);