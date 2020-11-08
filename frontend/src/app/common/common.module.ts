import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BearerInterceptor } from './interceptors/bearer.interceptor';
import { MainLayoutComponent } from './layouts/main/main.layout';
import { Page404Component } from './pages/404/404.component';

@NgModule({
  declarations: [
    Page404Component,
    MainLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule.forChild(),
    TooltipModule.forRoot()
  ],
  exports: [
    TranslateModule,
    TooltipModule,
    Page404Component,
    MainLayoutComponent
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
        }
      ]
    }
  }
}