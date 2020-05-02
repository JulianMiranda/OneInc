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
}
