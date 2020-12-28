import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Spinkit } from 'ng-http-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  spinkit = Spinkit;

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.translate.setDefaultLang('it');
  }

}
