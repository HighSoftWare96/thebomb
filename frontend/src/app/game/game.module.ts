import { StoreModule } from '@ngrx/store';
import { AppCommonModule } from './../common/common.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameRoutingModule } from './game.routing';
import { reducer } from './store/game.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AppCommonModule,
    GameRoutingModule,
    StoreModule.forFeature('game', reducer)
  ],
  exports: [],
  providers: [],
})
export class GameModule { }