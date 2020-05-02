import { createReducer, on } from '@ngrx/store';
import { setItems, unSetItems } from './payments.actions';
import { Payment } from 'src/app/models/payment.model';
import { AppState } from '../../app.reducer';

export interface State {
  items: Payment[];
}
export interface AppStateWithPayment extends AppState {
  payments: State;
}

export const initialState: State = {
  items: [],
};
const paymentsReducer = createReducer(
  initialState,
  on(setItems, (state, { items }) => ({ ...state, items: [...items] })),
  on(unSetItems, (state) => ({ ...state, items: [] }))
);
export function PaymentsReducer(state, action) {
  return paymentsReducer(state, action);
}
