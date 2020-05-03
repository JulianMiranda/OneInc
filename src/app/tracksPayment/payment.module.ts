import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { DetailsComponent } from './details/details.component';
import { StadisticComponent } from './stadistic/stadistic.component';
import { PaymentsComponent } from './payments/payments.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { SharedModule } from '../components/shared.module';
import { DashboardRoutesModule } from '../components/dashboard/dashboard-routes.module';
import { StoreModule } from '@ngrx/store';
import { PaymentsReducer } from './payments/payments.reducer';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    DashboardComponent,
    DetailsComponent,
    StadisticComponent,
    PaymentsComponent,
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature('payments', PaymentsReducer),
    ReactiveFormsModule,
    ChartsModule,
    SharedModule,
    DashboardRoutesModule,
    FormsModule,
    NgbDatepickerModule,
  ],
})
export class PaymentModule {}
