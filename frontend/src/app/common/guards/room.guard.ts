import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StartFacadeService } from 'src/app/start/store/startFacade.service';

@Injectable()
export class RoomGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return this.startFacade.currentRoom$.pipe(
      map((room) => room ? true : this.router.parseUrl('/home'))
    );
  }

  constructor(
    private startFacade: StartFacadeService,
    private router: Router
  ) { }
}
