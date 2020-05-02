import { Room } from './../shared/interfaces/Room';
import { createAction, props } from '@ngrx/store';
import { Partecipant } from '../shared/interfaces/Partecipant';

export const loadResetStore = createAction(
  '[Root.root] Reset all store'
);

export const loadUnsetDirty = createAction(
  '[Root.currentStore] Set current store dirty to false'
);

export const loadSetLockedNavigation = createAction(
  '[Root.navigation] Lock navigation',
  props<{ locked: boolean }>()
);

export const loadRefreshPartecipant = createAction(
  '[Auth] Try refresh partecipant',
);

export const loadRefreshPartecipantSuccess = createAction(
  '[Auth] Try refresh partecipant success',
  props<{ partecipant: Partecipant, jwt: string }>()
);

export const loadRefreshPartecipantFailure = createAction(
  '[Auth] Try refresh partecipant failure',
  props<{ error: any }>()
);

export const loadTryCreatePartecipant = createAction(
  '[Auth] Try create partecipant',
  props<{ name: string, avatarSeed: string }>()
);

export const loadTryCreatePartecipantSuccess = createAction(
  '[Auth] Try create partecipant success',
  props<{ partecipant: Partecipant, jwt: string }>()
);

export const loadTryCreatePartecipantFailure = createAction(
  '[Auth] Try create partecipant failure',
  props<{ error: any }>()
);

export const loadCreateRoom = createAction(
  '[Auth] create room',
  props<{ room: Room }>()
);

export const loadCreateRoomSuccess = createAction(
  '[Auth] create room success',
  props<{ room: Room }>()
);

export const loadCreateRoomFailure = createAction(
  '[Auth] create room failure',
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
