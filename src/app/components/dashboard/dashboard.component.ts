import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { PaymentService } from '../../services/payment.service';
import * as paymentActions from '../../tracksPayment/payments/payments.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  userSubs: Subscription;
  paymentsSubs: Subscription;
  constructor(
    private store: Store<AppState>,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.userSubs = this.store
      .select('user')
      .pipe(filter((auth) => auth.user != null))
      .subscribe(({ user }) => {
        this.paymentsSubs = this.paymentService
          .initPaymentListener(user.uid)
          .subscribe((paymentsFB) => {
            this.store.dispatch(paymentActions.setItems({ items: paymentsFB }));
          });
      });
  }
  ngOnDestroy() {
    this.userSubs?.unsubscribe();
    this.paymentsSubs?.unsubscribe();
  }
}
