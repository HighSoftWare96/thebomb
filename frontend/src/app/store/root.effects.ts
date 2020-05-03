import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class RootEffects {

  constructor(
    private action$: Actions
  ) { }

}
