import { SharedModule } from './../shared/shared.module';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BearerInterceptor } from './interceptors/bearer.interceptor';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Page404Component } from './pages/404/404.component';
import { MainLayoutComponent } from './layouts/main/main.layout';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    Page404Component,
    MainLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule.forChild(),
    TooltipModule.forRoot(),
    SharedModule.forRoot()
  ],
  exports: [
    TranslateModule,
    TooltipModule,
    SharedModule,
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