import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Payment } from 'src/app/models/payment.model';
import { Subscription } from 'rxjs';
import { PaymentService } from '../../services/payment.service';
import Swal from 'sweetalert2';
import { AppStateWithPayment } from '../payments/payments.reducer';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  payments: Payment[] = [];
  paymentSubscription: Subscription;
  constructor(
    private store: Store<AppStateWithPayment>,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.paymentSubscription = this.store
      .select('payments')
      .subscribe(({ items }) => (this.payments = items));
  }
  ngOnDestroy() {
    this.paymentSubscription.unsubscribe();
  }
  delete(uid: string) {
    this.paymentService
      .deletePayment(uid)
      .then(() => Swal.fire('Deleted!', 'Item deleted', 'success'))
      .catch((err) => Swal.fire('Error!', err.message, 'error'));
  }
  /* edit(payment: Payment) {
    if (this.paymentForm.invalid) {
      return;
    }
    this.store.dispatch(ui.isLoading());

    const { description, amount } = this.paymentForm.value;
    const payment = new Payment(description, amount);
    this.paymentService
      .createPayment(payment)
      .then(() => {
        this.paymentForm.reset();
        this.store.dispatch(ui.stopLoading());
        Swal.fire('Created register!', description, 'success');
      })
      .catch((err) => {
        Swal.fire('Error!', err.message, 'error');
        this.store.dispatch(ui.isLoading());
      });
  } */
}
