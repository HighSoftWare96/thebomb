import { GameState } from './play.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const getPlayFeature = createFeatureSelector<GameState>('game');

export const getCurrentGame = createSelector(
  getPlayFeature,
  (state: GameState) => state.game
);

export const getCurrentRound = createSelector(
  getPlayFeature,
  (state: GameState) => state.round
);

export const getGameResult = createSelector(
  getPlayFeature,
  (state: GameState) => state.gameResult
);

export const getStatus = createSelector(
  getPlayFeature,
  (state: GameState) => state.status
);
