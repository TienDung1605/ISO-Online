import { Pipe, PipeTransform } from '@angular/core';

import dayjs from 'dayjs/esm';

@Pipe({
  standalone: true,
  name: 'formatMediumDatetime',
})
export default class FormatMediumDatetimePipe implements PipeTransform {
  transform(day: string | dayjs.Dayjs | null | undefined): string {
    const date = day ? dayjs(day) : null;
    return date ? date.format('DD-MM-YYYY HH:mm:ss') : '';
  }
}
