import { Pipe, PipeTransform } from '@angular/core';
import { Payment } from '../models/payment.model';

@Pipe({
  name: 'datePipe',
})
export class PaymentPipe implements PipeTransform {
  transform(item: []): string {
    const a = Object.values(item);
    const year = a[0];
    const month = a[1];
    const day = a[2];

    const date = new Date(year, month, day).toDateString();

    return date;
  }
}
