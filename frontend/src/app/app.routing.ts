import { HomeComponent } from './start/pages/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Page404Component } from './common/pages/404/404.component';
import { RoomComponent } from './start/pages/room/room.component';
import { JoinComponent } from './start/pages/join/join.component';
import { WaitingRoomComponent } from './start/pages/waitingroom/waitingroom.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'play',
    loadChildren: () => import('./game/game.module').then(m => m.GameModule)
  },
  {
    path: '404',
    component: Page404Component
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
