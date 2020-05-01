import { createAction, props } from '@ngrx/store';
import { Payment } from 'src/app/models/payment.model';

export const unSetItems = createAction('[Payment] unSet Items');
export const setItems = createAction(
  '[Payment] Set Items',
  props<{ items: Payment[] }>()
);
