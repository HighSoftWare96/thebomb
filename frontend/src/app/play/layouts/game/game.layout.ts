import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { PlayFacadeService } from 'src/app/play/store/playFacade.service';

@Component({
  selector: 'app-game-layout',
  templateUrl: './game.layout.html',
  styleUrls: ['./game.layout.scss']
})
export class GameLayoutComponent implements OnInit {

  isMyTurn$: Observable<boolean>;
  isExploded$: Observable<boolean>;

  constructor(
    private playFacade: PlayFacadeService
  ) {
    this.isMyTurn$ = playFacade.isMyTurn$;
    this.isExploded$ = playFacade.isExploded$;
  }

  ngOnInit(): void { }
}
