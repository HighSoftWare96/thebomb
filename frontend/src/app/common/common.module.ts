import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BearerInterceptor } from './interceptors/bearer.interceptor';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    TooltipModule.forRoot()
  ],
  exports: [
    TranslateModule,
    TooltipModule
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