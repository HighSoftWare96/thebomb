import { GameGuard } from './guards/game.guard';
import { UpperfirstPipe } from './pipes/upperfirst.pipe';
import { ModalService } from './services/modal.service';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ToastrModule } from 'ngx-toastr';
import { GameAvatarComponent } from './components/gameAvatar/gameAvatar.component';
import { GameButtonComponent } from './components/gameButton/gameButton.component';
import { GameInputComponent } from './components/gameInput/gameInput.component';
import { GameSelectComponent } from './components/gameSelect/gameSelect.component';
import { ShortcutsBarComponent } from './components/shortcutsBar/shortcutsBar.component';
import { AuthGuard } from './guards/auth.guard';
import { LockableGuard } from './guards/lockable.guard';
import { RoomGuard } from './guards/room.guard';
import { BearerInterceptor } from './interceptors/bearer.interceptor';
import { MainLayoutComponent } from './layouts/main/main.layout';
import { ManualComponent } from './modals/manual/manual.component';
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
    GameAvatarComponent,
    ShortcutsBarComponent,
    ManualComponent,
    UpperfirstPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    TooltipModule.forRoot(),
    ToastrModule.forRoot(),
    FontAwesomeModule
  ],
  exports: [
    TranslateModule,
    TooltipModule,
    Page404Component,
    GameButtonComponent,
    MainLayoutComponent,
    GameInputComponent,
    GameSelectComponent,
    ShortcutsBarComponent,
    GameAvatarComponent,
    FontAwesomeModule,
    ManualComponent,
    UpperfirstPipe
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
        GameGuard,
        SoundEffectsService,
        LockableGuard,
        SettingsService,
        ModalService
      ]
    }
  }
}