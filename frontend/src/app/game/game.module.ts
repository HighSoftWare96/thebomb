import { AppCommonModule } from './../common/common.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameRoutingModule } from './game.routing';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AppCommonModule,
    GameRoutingModule
  ],
  exports: [],
  providers: [],
})
export class GameModule { }