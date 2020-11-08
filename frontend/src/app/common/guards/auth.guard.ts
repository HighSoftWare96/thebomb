import { StartFacadeService } from 'src/app/start/store/startFacade.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return this.startFacade.loggedPartecipant$.pipe(
      map((user) => user ? true : this.router.parseUrl('/home'))
    );
  }

  constructor(
    private startFacade: StartFacadeService,
    private router: Router
  ) { }
}
