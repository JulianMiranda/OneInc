import { filter } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Payment } from '../../models/payment.model';
import { AppStateWithPayment } from 'src/app/tracksPayment/payments/payments.reducer';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css'],
})
export class TopbarComponent implements OnInit, OnDestroy {
  payments = 0;
  totalPayments = 0;

  paymentSubs: Subscription;
  constructor(private store: Store<AppStateWithPayment>) {}

  ngOnInit(): void {
    this.paymentSubs = this.store
      .select('payments')
      .subscribe(({ items }) => this.generateStadistic(items));
  }
  ngOnDestroy() {
    this.paymentSubs.unsubscribe();
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
