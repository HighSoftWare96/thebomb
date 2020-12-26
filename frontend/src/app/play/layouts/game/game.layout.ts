import LockableComponent from 'src/app/shared/interfaces/LockableComponent';
import { HostListener } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlayFacadeService } from 'src/app/play/store/playFacade.service';

@Component({
  selector: 'app-game-layout',
  templateUrl: './game.layout.html',
  styleUrls: ['./game.layout.scss']
})
export class GameLayoutComponent implements OnInit, OnDestroy, LockableComponent {

  isMyTurn$: Observable<boolean>;
  isExploded$: Observable<boolean>;

  allowRedirect: boolean;
  subs: Array<Subscription> = [];

  canDeactivate(): boolean {
    return this.allowRedirect;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander() {
    // or directly false
    return this.allowRedirect;
  }

  onLeaving() {
    this.playFacade.leaveGame();
  }


  constructor(
    private playFacade: PlayFacadeService
  ) {
    this.isMyTurn$ = playFacade.isMyTurn$;
    this.isExploded$ = playFacade.isExploded$;
    this.subs.push(
      this.playFacade.currentGame$.subscribe(i => {
        this.allowRedirect = !i;
      })
    );
  }

  ngOnInit(): void { }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
}
