import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Payment } from 'src/app/models/payment.model';
import { AppStateWithPayment } from '../payments/payments.reducer';

@Component({
  selector: 'app-stadistic',
  templateUrl: './stadistic.component.html',
  styleUrls: ['./stadistic.component.css'],
})
export class StadisticComponent implements OnInit {
  payments = 0;
  totalPayments = 0;

  constructor(private store: Store<AppStateWithPayment>) {}

  ngOnInit(): void {
    this.store
      .select('payments')
      .subscribe(({ items }) => this.generateStadistic(items));
  }
  generateStadistic(items: Payment[]) {
    this.payments = 0;
    this.totalPayments = 0;
    for (const item of items) {
      this.totalPayments += item.amount;
      this.payments++;
    }
  }
}
