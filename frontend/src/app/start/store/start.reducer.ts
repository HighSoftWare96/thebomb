import { Partecipant } from 'src/app/shared/interfaces/Partecipant';
import { Room } from 'src/app/shared/interfaces/Room';
import { createReducer, on } from '@ngrx/store';
import * as startActions from './start.actions';

export interface StartState {
  partecipant: Partecipant;
  room: Room;
  roomates: Partecipant[];
}

const initialStartState: StartState = {
  partecipant: null,
  room: null,
  roomates: []
};

const startReducerFun = createReducer(initialStartState,
  on(startActions.loadRefreshPartecipantSuccess, (state, { partecipant }) => ({
    ...state,
    partecipant
  })),
  on(startActions.loadTryCreatePartecipantSuccess, (state, { partecipant }) => ({
    ...state,
    partecipant
  })),
  on(startActions.loadCreateRoomSuccess, (state, { room }) => ({
    ...state,
    room
  })),
  on(startActions.loadRoomatesChanged, (state, { room, partecipants }) => ({
    ...state,
    room,
    roomates: partecipants
  })),
  on(startActions.loadJoiningRoomSuccess, (state, { room }) => ({
    ...state,
    room
  })),
  on(startActions.loadJoinRoomSuccess, (state, { room, partecipant }) => ({
    ...state,
    room,
    partecipant
  })),
  on(startActions.loadLeaveRoom, (s) => ({
    ...s,
    room: null,
    roomates: []
  }))
);

export function startReducer(state, action) {
  return startReducerFun(state, action);
}