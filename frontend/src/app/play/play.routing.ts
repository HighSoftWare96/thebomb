import { RoomGuard } from './../common/guards/room.guard';
import { AuthGuard } from './../common/guards/auth.guard';
import { GameComponent } from './pages/game/game.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

const routes: Routes = [{
  path: 'game',
  component: GameComponent,
  canActivate: [AuthGuard, RoomGuard]
}];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayRoutingModule { }
