import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'upperfirst' })
export class UpperfirstPipe implements PipeTransform {
  transform(value: any): any {
    if (typeof value !== 'string') {
      return value;
    }

    return value.charAt(0).toUpperCase() + value.substr(1);
  }
}