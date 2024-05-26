import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: string | Date, dateFormat="MMMM D, yyyy"): string {

    return moment(value).format(dateFormat);
  }
}
