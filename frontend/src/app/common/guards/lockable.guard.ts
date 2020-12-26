import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { PlayFacadeService } from 'src/app/play/store/playFacade.service';
import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import LockableComponent from 'src/app/shared/interfaces/LockableComponent';

@Injectable({
  providedIn: 'root'
})
export class LockableGuard implements CanDeactivate<LockableComponent> {
  canDeactivate(
    component: LockableComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    if(component.canDeactivate$) {
      return component.canDeactivate$;
    }

    if (
      (component.allowRedirect === false ||
        (component.canDeactivate && !component.canDeactivate()))
    ) {
      // Angular bug! The stack navigation with candeactivate guard
      // messes up all the navigation stack...
      // see here: https://github.com/angular/angular/issues/13586#issuecomment-402250031
      this.location.go(currentState.url);

      if (
        window.confirm("Sicuro di voler lasciare il gioco?")
      ) {
        component.onLeaving && component.onLeaving();
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  constructor(
    private store: Store<any>,
    private location: Location
  ) { }
}