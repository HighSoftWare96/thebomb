import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Page404Component } from './pages/404/404.component';
import { RoomComponent } from './pages/room/room.component';
import { JoinComponent } from './pages/join/join.component';
import { WaitingRoomComponent } from './pages/waitingroom/waitingroom.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'join/:inviteId',
    component: JoinComponent
  },
  {
    path: 'rooms/new',
    component: RoomComponent
  },
  {
    path: 'waitingroom',
    component: WaitingRoomComponent
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
