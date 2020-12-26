import { LockableGuard } from './guards/lockable.guard';
import { GameSelectComponent } from './components/gameSelect/gameSelect.component';
import { GameButtonComponent } from './components/gameButton/gameButton.component';
import { RoomGuard } from './guards/room.guard';
import { AuthGuard } from './guards/auth.guard';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BearerInterceptor } from './interceptors/bearer.interceptor';
import { MainLayoutComponent } from './layouts/main/main.layout';
import { Page404Component } from './pages/404/404.component';
import { SoundEffectsService } from './services/soundEffects.service';
import { GameInputComponent } from './components/gameInput/gameInput.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    Page404Component,
    GameButtonComponent,
    MainLayoutComponent,
    GameInputComponent,
    GameSelectComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule.forChild(),
    TooltipModule.forRoot()
  ],
  exports: [
    TranslateModule,
    TooltipModule,
    Page404Component,
    GameButtonComponent,
    MainLayoutComponent,
    GameInputComponent,
    GameSelectComponent,
  ]
})
export class AppCommonModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppCommonModule,
      providers: [
        BearerInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useExisting: BearerInterceptor,
          multi: true
        },
        AuthGuard,
        RoomGuard,
        SoundEffectsService,
        LockableGuard
      ]
    }
  }
}