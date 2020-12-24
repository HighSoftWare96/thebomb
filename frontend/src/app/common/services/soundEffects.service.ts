import { Injectable } from '@angular/core';

const SOUNDS = {
  button: '../../../assets/sounds/button.mp3'
};

@Injectable()
export class SoundEffectsService {
  soundCache = {};

  constructor() { }

  play(soundKey, config = {}) {
    if (!SOUNDS[soundKey]) {
      console.warn('Sound key not found: ', soundKey);
      return;
    }

    if (!this.soundCache[soundKey]) {
      this.soundCache[soundKey] = new Audio(SOUNDS[soundKey]);
    }

    this.soundCache[soundKey].play();
  }
}