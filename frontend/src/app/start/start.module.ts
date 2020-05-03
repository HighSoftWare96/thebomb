import { StartEffects } from './store/start.effects';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { RoomComponent } from './pages/room/room.component';
import { WaitingRoomComponent } from './pages/waitingroom/waitingroom.component';
import { JoinComponent } from './pages/join/join.component';
import { AppCommonModule } from '../common/common.module';
import { StoreModule } from '@ngrx/store';
import { startReducer } from './store/start.reducer';
import { StartFacadeService } from './store/startFacade.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StartRoutingModule } from './start.routing';

@NgModule({
  declarations: [
    HomeComponent,
    JoinComponent,
    RoomComponent,
    WaitingRoomComponent
  ],
  imports: [
    CommonModule,
    AppCommonModule,
    FormsModule,
    ReactiveFormsModule,
    StartRoutingModule,
    StoreModule.forFeature('start', startReducer),
    EffectsModule.forFeature([StartEffects])
  ],
  exports: [],
  providers: [
    StartFacadeService
  ],
})
export class StartModule { }