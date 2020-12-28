import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SettingsService } from './common/services/settings.service';
import { Component, OnInit, OnDestroy, AfterViewChecked, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Spinkit } from 'ng-http-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  spinkit = Spinkit;

  subs: Subscription[] = [];

  constructor(
    private settings: SettingsService,
    private translate: TranslateService,
    private toaster: ToastrService
  ) {
  }

  ngOnDestroy() { }

  ngOnInit() {
    this.translate.setDefaultLang('it');
    this.translate.addLangs(['it', 'en']);

    this.subs.push(
      this.settings.settings$.subscribe(s => {
        this.translate.use(s.lang);
      })
    );
  }
  
  ngAfterViewInit() {
    (window as any).particlesJS.load(
      'particlesjs',
      '../assets/configs/particlesjs-config.json',
      function () { }
    );
  }

}
