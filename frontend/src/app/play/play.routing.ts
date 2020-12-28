import { GameGuard } from './../common/guards/game.guard';
import { LockableGuard } from '../common/guards/lockable.guard';
import { GameLayoutComponent } from './layouts/game/game.layout';
import { RoomGuard } from './../common/guards/room.guard';
import { AuthGuard } from './../common/guards/auth.guard';
import { GameComponent } from './pages/game/game.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

const routes: Routes = [{
  path: 'play',
  component: GameLayoutComponent,
  children: [{
    path: 'game',
    pathMatch: 'full',
    component: GameComponent
  }],
  canActivate: [AuthGuard, RoomGuard, GameGuard],
  canDeactivate: [LockableGuard]
}];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayRoutingModule { }
