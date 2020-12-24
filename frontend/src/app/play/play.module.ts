import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GameComponent } from './pages/game/game.component';
import { PlayFacadeService } from './store/playFacade.service';
import { PlayEffects } from './store/play.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AppCommonModule } from '../common/common.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayRoutingModule } from './play.routing';
import { reducer } from './store/play.reducer';
import { GameLayoutComponent } from './layouts/game/game.layout';

@NgModule({
  declarations: [
    GameComponent,
    GameLayoutComponent
  ],
  imports: [
    CommonModule,
    AppCommonModule,
    PlayRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('game', reducer),
    EffectsModule.forFeature([PlayEffects])
  ],
  exports: [],
  providers: [
    PlayFacadeService
  ],
})
export class PlayModule { }