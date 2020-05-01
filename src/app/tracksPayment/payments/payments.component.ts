import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Payment } from '../../models/payment.model';
import { PaymentService } from '../../services/payment.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from '../../components/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent implements OnInit, OnDestroy {
  paymentForm: FormGroup;
  loading = false;
  loadingSubs: Subscription;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.loadingSubs = this.store
      .select('ui')
      .subscribe(({ isLoading }) => (this.loading = isLoading));
    this.paymentForm = this.fb.group({
      description: ['', Validators.required],
      amount: ['', Validators.required],
    });
  }
  ngOnDestroy() {
    this.loadingSubs.unsubscribe();
  }

  save() {
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
  }
}
