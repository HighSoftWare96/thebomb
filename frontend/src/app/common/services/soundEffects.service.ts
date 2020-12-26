import { Injectable } from '@angular/core';

const SOUNDS = {
  button: '../../../assets/sounds/button.mp3'
};

const MUSICS = {
  clock: '../../../assets/sounds/clock.mp3'
};

@Injectable()
export class SoundEffectsService {
  soundCache = {};
  musicCache = {};
  currentPlaying = {};

  constructor() { }

  playEffect(soundKey, config = {}) {
    if (!SOUNDS[soundKey]) {
      console.warn('Sound key not found: ', soundKey);
      return;
    }

    if (!this.soundCache[soundKey]) {
      this.soundCache[soundKey] = new Audio(SOUNDS[soundKey]);
      this.soundCache[soundKey].load();
      this.soundCache[soundKey].addEventListener('playing', () => {
        this.currentPlaying[soundKey] = this.soundCache[soundKey];
      });
      this.soundCache[soundKey].addEventListener('ended', () => {
        delete this.currentPlaying[soundKey];
      });
    }

    this.soundCache[soundKey].play();
  }

  playMusic(musicKey, config = {}) {
    if (!MUSICS[musicKey]) {
      console.warn('Music key not found: ', musicKey);
      return;
    }

    if (!this.musicCache[musicKey]) {
      this.musicCache[musicKey] = new Audio(MUSICS[musicKey]);
      this.musicCache[musicKey].load();
      this.musicCache[musicKey].addEventListener('playing', () => {
        this.currentPlaying[musicKey] = this.musicCache[musicKey];
      });
      this.musicCache[musicKey].addEventListener('ended', () => {
        delete this.currentPlaying[musicKey];
      });
    }

    this.musicCache[musicKey].play();
    this.musicCache[musicKey].loop = true;
  }

  stopMusic(musicKey) {
    if (!MUSICS[musicKey]) {
      console.warn('Music key not found: ', musicKey);
      return;
    }

    if(this.musicCache[musicKey]) {
      this.musicCache[musicKey].pause();
    }
  }
}