import { Round } from './../../shared/interfaces/Round';
import { createAction, props } from '@ngrx/store';
import { Game } from 'src/app/shared/interfaces/Game';
import { GameStats } from 'src/app/shared/interfaces/GameStats';
import { WrongReason } from 'src/app/shared/interfaces/WrongReasons';

export const loadStartGame = createAction(
  '[Game] Start game',
  props<{ gameSettings: any }>()
);

export const loadStartGameSuccess = createAction(
  '[Game] Start game success',
  props<{ game: Game }>()
);

export const loadStartGameFailure = createAction(
  '[Game] Start game failure',
  props<{ error: any }>()
);

export const loadGameEnded = createAction(
  '[Game.socketio] game ended',
  props<{ game: Game, statistics: GameStats }>()
);

export const loadRoundStarted = createAction(
  '[Game.socketio] round started',
  props<{ round: Round }>()
);

export const loadRoundEnded = createAction(
  '[Game.socketio] round ended',
  props<{ round: Round }>()
);

export const loadTurnChecked = createAction(
  '[Game.socketio] round checked ok',
  props<{ round: Round, previousRound: Round, response: string }>()
);

export const loadTurnWrong = createAction(
  '[Game.socketio] round wrong ok',
  props<{ round: Round, reason?: WrongReason, response: string }>()
);

export const loadResetGame = createAction(
  '[Game.reset] reset game'
);

export const loadSendResponse = createAction(
  '[Game.send] load send response',
  props<{ response: string }>()
);

export const leaveGame = createAction(
  '[Game.end] leave game'
);

export const goWaitingRoom = createAction(
  '[Game.end] go waiting room'
);

export const recallWaitingRoom = createAction(
  '[Game.end] recall waiting room'
);
