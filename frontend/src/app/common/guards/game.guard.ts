import { PlayFacadeService } from './../../play/store/playFacade.service';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StartFacadeService } from 'src/app/start/store/startFacade.service';

@Injectable()
export class GameGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return this.playFacade.currentGame$.pipe(
      map((game) => game ? true : this.router.parseUrl('/home'))
    );
  }

  constructor(
    private playFacade: PlayFacadeService,
    private router: Router
  ) { }
}
