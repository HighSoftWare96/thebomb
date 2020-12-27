import { Injectable } from '@angular/core';

const DEFAULTS = {
  sounds: true
};

@Injectable()
export class SettingsService {
  settingCache = {};

  get(key: string) {
    if (!localStorage || this.settingCache[key] !== undefined) {
      return this.settingCache[key] || DEFAULTS[key];
    }

    const localValue = localStorage.getItem(key);
    return localValue || DEFAULTS[key];
  }
  set(key: string, value: any) {
    this.settingCache[key] = value;
    if (localStorage) {
      localStorage.setItem(key, JSON.stringify(value));
    }
    return value;
  }
}