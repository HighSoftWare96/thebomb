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
  '[Auth] Try refresh partecipant',
  props<{ error: any }>()
);
