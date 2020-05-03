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
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

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

  model: NgbDateStruct;

  today = new Date();
  substracDays = new Date();
  minDate: any;
  maxDate: any;

  other = new Date();
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
    console.log(this.firstDate);

    this.substracDays.setDate(this.today.getDate() - 6);

    this.maxDate = {
      year: this.today.getFullYear(),
      month: this.today.getMonth(),
      day: this.today.getDate(),
    };
    this.minDate = {
      year: this.substracDays.getFullYear(),
      month: this.substracDays.getMonth(),
      day: this.substracDays.getDate(),
    };
    this.paymentForm = this.fb.group({
      description: this.firstDesc,
      amount: this.firstAmount,
      date: JSON.stringify(this.firstDate),
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
