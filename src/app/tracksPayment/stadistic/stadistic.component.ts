import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Payment } from 'src/app/models/payment.model';
import { AppStateWithPayment } from '../payments/payments.reducer';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
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
  firstDesc: string;
  firstAmount: number;
  firstDate: Date;

  createFormGroup() {
    return new FormGroup({
      description: new FormControl('', [Validators.maxLength(255)]),
      amount: new FormControl('', [Validators.required, Validators.min(0)]),
      date: new FormControl('', [Validators.required]),
    });
  }

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private store: Store<AppStateWithPayment>,
    private route: ActivatedRoute
  ) {
    this.paymentForm = this.createFormGroup();
    this.uid = this.route.snapshot.paramMap.get('id');
  }
  get description() {
    return this.paymentForm.get('description');
  }
  get amount() {
    return this.paymentForm.get('amount');
  }
  get date() {
    return this.paymentForm.get('date');
  }

  ngOnInit() {
    this.loadingSubs = this.store
      .select('ui')
      .subscribe(({ isLoading }) => (this.loading = isLoading));
    this.paymentSubscription = this.store
      .select('payments')
      .subscribe(({ items }) => {
        this.payments = items;
        this.payments.filter((uid) => {
          if (uid.uid === this.uid) {
            this.firstDesc = uid.description;
            this.firstAmount = uid.amount;
            this.firstDate = uid.date;
          }
        });
      });

    this.paymentForm = this.fb.group({
      description: this.firstDesc,
      amount: this.firstAmount,
      date: this.firstDate,
    });
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
    const { description, amount, date } = this.paymentForm.value;
    const payment = new Payment(description, amount, date);
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
