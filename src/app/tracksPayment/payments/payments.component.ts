import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Payment } from '../../models/payment.model';
import { PaymentService } from '../../services/payment.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from '../../components/ui.actions';
import { Subscription } from 'rxjs';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
})
export class PaymentsComponent implements OnInit, OnDestroy {
  paymentForm: FormGroup;
  loading = false;
  loadingSubs: Subscription;
  model: NgbDateStruct;

  today = new Date();
  substracDays = new Date();
  minDate: any;
  maxDate: any;

  createFormGroup() {
    return new FormGroup({
      description: new FormControl('', [Validators.maxLength(255)]),
      amount: new FormControl('', [Validators.required, Validators.min(0)]),
      date: new FormControl('', [Validators.required]),
    });
  }

  constructor(
    private paymentService: PaymentService,
    private store: Store<AppState>
  ) {
    this.paymentForm = this.createFormGroup();
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
    this.substracDays.setDate(this.today.getDate() - 6);

    this.maxDate = {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate(),
    };
    this.minDate = {
      year: this.substracDays.getFullYear(),
      month: this.substracDays.getMonth() + 1,
      day: this.substracDays.getDate(),
    };
  }
  ngOnDestroy() {
    this.loadingSubs.unsubscribe();
  }

  save() {
    if (this.paymentForm.invalid) {
      return;
    }

    this.store.dispatch(ui.isLoading());

    const { description, amount, date } = this.paymentForm.value;
    const payment = new Payment(description, amount, date);
    this.paymentService
      .createPayment(payment)
      .then(() => {
        this.paymentForm.reset();
        this.store.dispatch(ui.stopLoading());
        Swal.fire('Payment Added!', description, 'success');
      })
      .catch((err) => {
        Swal.fire('Error!', err.message, 'error');
        this.store.dispatch(ui.isLoading());
      });
  }
}
