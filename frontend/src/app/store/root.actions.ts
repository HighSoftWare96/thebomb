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
