import { Routes } from '@angular/router';
import { StadisticComponent } from '../../tracksPayment/stadistic/stadistic.component';
import { DetailsComponent } from '../../tracksPayment/details/details.component';
import { PaymentsComponent } from '../../tracksPayment/payments/payments.component';

export const dashboardRoutes: Routes = [
  { path: '', component: StadisticComponent },
  { path: 'payment', component: PaymentsComponent },
  { path: 'details', component: DetailsComponent },
];
