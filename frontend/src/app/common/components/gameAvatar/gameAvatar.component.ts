import { Component, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { generateAvatarSeed } from 'src/app/shared/helpers/random';

@Component({
  selector: 'game-avatar',
  templateUrl: './gameAvatar.component.html',
  styleUrls: ['./gameAvatar.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: GameAvatarComponent,
    multi: true,
  }]
})
export class GameAvatarComponent implements OnInit {
  @Input() changable: boolean = true;
  @Input() size: number = 12;
  @Input() transition = false;

  onTouched = () => { };
  onChange = _ => { };
  value: string;

  constructor() { }

  ngOnInit() { }

  clearInput() {
    this.onChange('');
  }

  onInputChange() {
    this.onChange(this.value);
  }

  onBlur() {
    this.onTouched();
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  writeValue(value: string) {
    this.value = value;
  }

  changeAvatar() {
    if (!this.changable) {
      return;
    }

    const randomString = generateAvatarSeed();
    this.value = randomString;
    this.onInputChange();
  }
}
