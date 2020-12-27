import { Component, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormControl, FormControlDirective, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'game-input',
  templateUrl: './gameInput.component.html',
  styleUrls: ['./gameInput.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => GameInputComponent),
    multi: true,
  }]
})
export class GameInputComponent implements ControlValueAccessor {

  @Input() type = 'text';
  onChange;
  _value;
  isDisabled = false;

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    this.onChange(this._value);
  }

  writeValue(value) {
    this._value = value;
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }
  registerOnTouched(fn) { }

  setDisabledState(isDisabled) {
    this.isDisabled = isDisabled;
  }

}
