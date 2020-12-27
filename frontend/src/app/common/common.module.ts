import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ToastrModule } from 'ngx-toastr';
import { GameAvatarComponent } from './components/gameAvatar/gameAvatar.component';
import { GameButtonComponent } from './components/gameButton/gameButton.component';
import { GameInputComponent } from './components/gameInput/gameInput.component';
import { GameSelectComponent } from './components/gameSelect/gameSelect.component';
import { AuthGuard } from './guards/auth.guard';
import { LockableGuard } from './guards/lockable.guard';
import { RoomGuard } from './guards/room.guard';
import { BearerInterceptor } from './interceptors/bearer.interceptor';
import { MainLayoutComponent } from './layouts/main/main.layout';
import { Page404Component } from './pages/404/404.component';
import { SettingsService } from './services/settings.service';
import { SoundEffectsService } from './services/soundEffects.service';

@NgModule({
  declarations: [
    Page404Component,
    GameButtonComponent,
    MainLayoutComponent,
    GameInputComponent,
    GameSelectComponent,
    GameAvatarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    TooltipModule.forRoot(),
    ToastrModule.forRoot(),
  ],
  exports: [
    TranslateModule,
    TooltipModule,
    Page404Component,
    GameButtonComponent,
    MainLayoutComponent,
    GameInputComponent,
    GameSelectComponent,
    GameAvatarComponent
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
        LockableGuard,
        SettingsService
      ]
    }
  }
}