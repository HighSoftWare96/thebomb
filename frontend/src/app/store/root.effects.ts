import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

@Injectable()
export class RootEffects {

  constructor(
    private action$: Actions,
  ) { }

}
