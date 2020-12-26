import { createAction, props } from '@ngrx/store';
import { Game } from 'src/app/shared/interfaces/Game';
import { Partecipant } from 'src/app/shared/interfaces/Partecipant';
import { Room } from 'src/app/shared/interfaces/Room';

export const loadRefreshPartecipant = createAction(
  '[Start] Try refresh partecipant',
);

export const loadRefreshPartecipantSuccess = createAction(
  '[Start] Try refresh partecipant success',
  props<{ partecipant: Partecipant, jwt: string }>()
);

export const loadRefreshPartecipantFailure = createAction(
  '[Start] Try refresh partecipant failure',
  props<{ error: any }>()
);

export const loadTryCreatePartecipant = createAction(
  '[Start] Try create partecipant',
  props<{ name: string, avatarSeed: string }>()
);

export const loadTryCreatePartecipantSuccess = createAction(
  '[Start] Try create partecipant success',
  props<{ partecipant: Partecipant, jwt: string }>()
);

export const loadTryCreatePartecipantFailure = createAction(
  '[Start] Try create partecipant failure',
  props<{ error: any }>()
);

export const loadCreateRoom = createAction(
  '[Start] create room',
  props<{ room: Room }>()
);

export const loadCreateRoomSuccess = createAction(
  '[Start] create room success',
  props<{ room: Room }>()
);

export const loadCreateRoomFailure = createAction(
  '[Start] create room failure',
  props<{ error: any }>()
);

export const loadNewRoomate = createAction(
  '[Room] new roomate',
  props<{ room: Room, partecipants: Partecipant[] }>()
);

export const loadJoiningRoom = createAction(
  '[Start] load joining room'
);

export const loadJoiningRoomSuccess = createAction(
  '[Start] load joining room success',
  props<{ room: Room }>()
);

export const loadJoiningRoomFailure = createAction(
  '[Start] load joining room failure',
  props<{ error: any }>()
);

export const loadJoinRoom = createAction(
  '[Start] new partecipant, join room',
  props<{ name: string, avatarSeed: string }>()
);

export const loadJoinRoomSuccess = createAction(
  '[Start] new partecipant, join room success',
  props<{ room: Room, partecipant: Partecipant }>()
);

export const loadJoinRoomFailure = createAction(
  '[Start] new partecipant, join room failure',
  props<{ error: any }>()
);

export const loadGameStarted = createAction(
  '[Start.socketio] game started',
  props<{ game: Game }>()
);
