import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datePipe',
})
export class PaymentPipe implements PipeTransform {
  transform(item: any): string {
    const date = new Date(`${item.year}-${item.month}-${item.day}`);
    return date.toDateString();
  }
}
