import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { JoinComponent } from './pages/join/join.component';
import { RoomComponent } from './pages/room/room.component';
import { WaitingRoomComponent } from './pages/waitingroom/waitingroom.component';
import { MainLayoutComponent } from '../common/layouts/main/main.layout';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
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
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class StartRoutingModule { }
