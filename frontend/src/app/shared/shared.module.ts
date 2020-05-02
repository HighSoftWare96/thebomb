import { RoomApi } from './apis/room.service';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartecipantApi } from './apis/partecipant.service';
import { GameApi } from './apis/game.service';
import { SocketioService } from './apis/socketio.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: []
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        PartecipantApi,
        RoomApi,
        GameApi,
        SocketioService
      ]
    };
  }
}