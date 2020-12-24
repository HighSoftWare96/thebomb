import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SoundEffectsService } from '../../services/soundEffects.service';

@Component({
  selector: 'game-select',
  templateUrl: './gameSelect.component.html',
  styleUrls: ['./gameSelect.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => GameSelectComponent),
    multi: true
  }]
})
export class GameSelectComponent implements OnInit, ControlValueAccessor {
  @Input() options = [];

  onChange: any = () => { }
  onTouch: any = () => { }

  _value = "" // this is the updated value that the class accesses

  set value(val) {  // this value is updated by programmatic changes if( val !== undefined && this.val !== val){
    this._value = val;
    this.onChange(val);
    this.onTouch(val);
  }


  constructor() { }

  ngOnInit(): void { }

  // this method sets the value programmatically
  writeValue(value: any) {
    this.value = value
  }
  // upon UI element value changes, this method gets triggered
  registerOnChange(fn: any) {
    this.onChange = fn
  }
  // upon touching the element, this method gets triggered
  registerOnTouched(fn: any) {
    this.onTouch = fn
  }
}
