import { PartecipantApi } from './../shared/apis/partecipant.service';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as rootActions from './root.actions';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { BearerInterceptor } from '../common/interceptors/bearer.interceptor';

@Injectable()
export class RootEffects {

  constructor(
    private action$: Actions,
    private partecipantApi: PartecipantApi,
    private bearerInterceptor: BearerInterceptor
  ) { }

  // refresh partecipant
  @Effect()
  loadRefreshPartecipantEffect$ = this.action$.pipe(
    ofType(rootActions.loadRefreshPartecipant),
    switchMap(() => this.partecipantApi.refresh().pipe(
      map(({ partecipant, jwt }) => rootActions.loadRefreshPartecipantSuccess({ partecipant, jwt })),
      catchError(error => of(rootActions.loadRefreshPartecipantFailure(error)))
    ))
  )

  @Effect({
    dispatch: false
  })
  loadRefreshPartecipantSuccessEffect$ = this.action$.pipe(
    ofType(rootActions.loadRefreshPartecipantSuccess),
    tap(({ partecipant, jwt }) => {
      this.bearerInterceptor.setJwt(jwt);
    })
  )
}
