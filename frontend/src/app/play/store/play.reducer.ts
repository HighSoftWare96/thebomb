import { GameStats } from './../../shared/interfaces/GameStats';
import { createReducer, on } from '@ngrx/store';
import { Game } from 'src/app/shared/interfaces/Game';
import * as playActions from './play.actions';
import { Round } from 'src/app/shared/interfaces/Round';

export type GameStatus =
  'LOADING' | 'PLAYING' | 'END' | 'NONE' | 'ROUND_STARTED' | 'ROUND_ENDED';

export interface GameState {
  status: GameStatus;
  game: Game;
  round: Round;
  gameResult: GameStats;
}

const initialState: GameState = {
  status: 'NONE',
  game: undefined,
  round: undefined,
  gameResult: []
};

const gameStateReducer = createReducer(
  initialState,
  on(playActions.loadStartGameSuccess, (state, { game }) => ({
    ...state,
    game
  })),
  on(playActions.loadGameStarted, (state, { game }) => ({
    ...state,
    game,
    status: 'PLAYING'
  })),
  on(playActions.loadRoundStarted, (state, { round }) => ({
    ...state,
    round,
    status: 'ROUND_STARTED'
  })),
  on(playActions.loadRoundEnded, (state, { round }) => ({
    ...state,
    round,
    status: 'ROUND_ENDED'
  })),
  on(playActions.loadTurnChecked, (state, { round }) => ({
    ...state,
    round,
    status: 'ROUND_STARTED'
  })),
  on(playActions.loadTurnWrong, (state, { round }) => ({
    ...state,
    round,
    status: 'ROUND_STARTED'
  })),
  on(playActions.loadGameEnded, (state, { game, statistics }) => ({
    ...state,
    round: undefined,
    status: 'END',
    game,
    gameResult: statistics
  })),
  on(playActions.loadResetGame, (state) => ({
    ...initialState
  }))
);

export function reducer(state, action) {
  return gameStateReducer(state, action);
}