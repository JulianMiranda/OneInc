import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Payment } from 'src/app/models/payment.model';
import { AppStateWithPayment } from '../payments/payments.reducer';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PaymentService } from '../../services/payment.service';
import { ActivatedRoute } from '@angular/router';

import * as ui from '../../components/ui.actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stadistic',
  templateUrl: './stadistic.component.html',
  styleUrls: ['./stadistic.component.css'],
})
export class StadisticComponent implements OnInit, OnDestroy {
  paymentForm: FormGroup;
  loading = false;
  loadingSubs: Subscription;
  paymentSubscription: Subscription;
  payments: Payment[] = [];
  uid: string;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private store: Store<AppStateWithPayment>,
    private route: ActivatedRoute
  ) {
    this.uid = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.loadingSubs = this.store
      .select('ui')
      .subscribe(({ isLoading }) => (this.loading = isLoading));

    this.paymentForm = this.fb.group({
      description: ['', Validators.required],
      amount: ['', Validators.required],
    });

    this.paymentSubscription = this.store
      .select('payments')
      .subscribe(({ items }) => (this.payments = items));
  }
  ngOnDestroy() {
    this.loadingSubs.unsubscribe();
    this.paymentSubscription.unsubscribe();
  }
  edit() {
    if (this.paymentForm.invalid) {
      return;
    }
    this.store.dispatch(ui.isLoading());
    const uid = this.uid;
    const { description, amount } = this.paymentForm.value;
    const payment = new Payment(description, amount);
    this.paymentService
      .editPayment(payment, uid)
      .then(() => {
        this.paymentForm.reset();
        this.store.dispatch(ui.stopLoading());
        Swal.fire('Updated Payment!', description, 'success');
      })
      .catch((err) => {
        Swal.fire('Error!', err.message, 'error');
        this.store.dispatch(ui.isLoading());
      });
  }
}
