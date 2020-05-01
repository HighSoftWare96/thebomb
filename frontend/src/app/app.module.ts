import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppCommonModule } from './common/common.module';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { CustomStoreRouteSerializer } from './store/utils/CustomRouterStoreSerializer';
import { reducers } from './store/root.reducers';
import { RootEffects } from './store/root.effects';
import { RootFacadeService } from './store/rootFacade.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    AppCommonModule.forRoot(),
    StoreModule.forRoot(
      reducers
    ),
    EffectsModule.forRoot([
      RootEffects
    ]),
    StoreDevtoolsModule.instrument({
      logOnly: environment.production
    }),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomStoreRouteSerializer
    }),
  ],
  providers: [
    RootFacadeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
