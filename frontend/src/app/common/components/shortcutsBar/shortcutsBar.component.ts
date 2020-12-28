import { ModalService } from './../../services/modal.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { faHome, faInfo, faLanguage, faShareAlt, faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { SettingsKeys, SettingsService } from './../../services/settings.service';
import { SoundEffectsService } from './../../services/soundEffects.service';
import { ManualComponent } from '../../modals/manual/manual.component';

@Component({
  selector: 'game-shortcutsBar',
  templateUrl: './shortcutsBar.component.html',
  styleUrls: ['./shortcutsBar.component.scss']
})
export class ShortcutsBarComponent implements OnInit {
  settings$: Observable<{ [key in SettingsKeys]?: any }>;
  faVolumeOn = faVolumeUp;
  faVolumeOff = faVolumeMute;
  faHome = faHome;
  faInfo = faInfo;
  faShare = faShareAlt;
  faLang = faLanguage;

  constructor(
    private settingsManager: SettingsService,
    private soundEffects: SoundEffectsService,
    private router: Router,
    private modalService: ModalService,
    private viewRef: ViewContainerRef
  ) {
    this.settings$ = settingsManager.settings$;
  }

  ngOnInit(): void { }

  toggleSetting(key: SettingsKeys, value: any) {
    // changing the sounds => stop all music
    if (key === 'sounds' && !value) {
      this.soundEffects.stopAll();
    }
    this.settingsManager.set(key, value);
    this.playSound();
  }

  private playSound() {
    this.soundEffects.playEffect('button');
  }

  goToHome() {
    this.router.navigateByUrl('/home', { replaceUrl: true });
    this.playSound();
  }

  copyUrl() {
    navigator.clipboard.writeText(document.baseURI).then(() => { });
  }

  openInfo() {
    this.modalService.open(this.viewRef, ManualComponent);
  }

  changeLang() { }

}
