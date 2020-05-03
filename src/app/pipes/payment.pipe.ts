import { Pipe, PipeTransform } from '@angular/core';
import { Payment } from '../models/payment.model';

@Pipe({
  name: 'ordenIngreso',
})
export class PaymentPipe implements PipeTransform {
  transform(items: Payment[]): Payment[] {
    return items;

    /*  return items.sort( (a, b) => {

      if ( a.tipo === 'ingreso' ) {
        return -1;
      } else {
        return 1;
      } */
  }
}
