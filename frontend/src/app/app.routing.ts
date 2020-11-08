import { AuthGuard } from './common/guards/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Page404Component } from './common/pages/404/404.component';


const routes: Routes = [
  {
    path: 'play',
    loadChildren: () => import('./play/play.module').then(m => m.PlayModule)
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
