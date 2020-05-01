import { createReducer } from '@ngrx/store';

export type GameStatus =
  'LOADING' | 'WAITING_ROOM' | 'PLAYING' | 'END' | 'NONE';

export interface GameState {
  status: GameStatus;
}

const initialState: GameState = {
  status: 'NONE'
};

const gameStateReducer = createReducer(initialState)

export function reducer(state, action) {
  return gameStateReducer(state, action);
}