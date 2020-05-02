import { WaitingRoomComponent } from './pages/waitingroom/waitingroom.component';
import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { reducers } from './store/root.reducer';
import { RootEffects } from './store/root.effects';
import { RootFacadeService } from './store/rootFacade.service';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { Page404Component } from './pages/404/404.component';
import { RoomComponent } from './pages/room/room.component';
import { JoinComponent } from './pages/join/join.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    Page404Component,
    RoomComponent,
    WaitingRoomComponent,
    JoinComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
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
    SharedModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [
    RootFacadeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
