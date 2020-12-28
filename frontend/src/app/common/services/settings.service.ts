import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type SettingsKeys = 'sounds';

const DEFAULTS: { [key in SettingsKeys]: any } = {
  sounds: true
};

const SETTINGS_PREFIX = '$settings_';
@Injectable()
export class SettingsService {
  private settingsCache$: BehaviorSubject<{ [key in SettingsKeys]?: any }>;
  settings$: Observable<{ [key in SettingsKeys]?: any }>;

  constructor() {
    this.settingsCache$ = new BehaviorSubject({});
    this.settings$ = this.settingsCache$.asObservable();
    this.load();
  }

  get(key: SettingsKeys) {
    if (!localStorage || this.settingsCache$.value[key] !== undefined) {
      return this.settingsCache$.value[key] !== undefined ?
        this.settingsCache$.value[key] : DEFAULTS[key];
    }

    const localValue = localStorage.getItem(`${SETTINGS_PREFIX}${key}`);
    return localValue !== null ? JSON.parse(localValue) : DEFAULTS[key];
  }

  set(key: SettingsKeys, value: any) {
    const newSettings = this.settingsCache$.value;
    newSettings[key] = value;
    if (localStorage) {
      localStorage.setItem(`${SETTINGS_PREFIX}${key}`, JSON.stringify(value));
    }
    this.settingsCache$.next(newSettings);
    return value;
  }

  private load() {
    let loadedSettings = {};
    if (!localStorage) {
      loadedSettings = { ...DEFAULTS };
    } else {
      for (const settingKey in DEFAULTS) {
        const foundValue = localStorage.getItem(`${SETTINGS_PREFIX}${settingKey}`);
        loadedSettings[settingKey] = foundValue !== null ?
          JSON.parse(foundValue) : DEFAULTS[settingKey];
      }
    }
    this.settingsCache$.next(loadedSettings);
    return;
  }
}