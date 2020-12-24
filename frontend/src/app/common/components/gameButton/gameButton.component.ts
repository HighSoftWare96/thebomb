import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SoundEffectsService } from '../../services/soundEffects.service';

@Component({
  selector: 'game-button',
  templateUrl: './gameButton.component.html',
  styleUrls: ['./gameButton.component.scss']
})
export class GameButtonComponent implements OnInit {

  @Input() type = 'button';
  @Input() sound = true;
  @Input() soundKey = 'button';
  @Input() disabled: boolean = false;
  @Output() click = new EventEmitter();

  constructor(
    private soundEffects: SoundEffectsService
  ) { }

  ngOnInit(): void { }

  onClick(event) {
    if (this.sound) {
      this.soundEffects.play(this.soundKey);
    }
    this.click.emit(event);
  }
}
