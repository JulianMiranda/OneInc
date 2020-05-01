import { User } from './../models/user.model';
import { createReducer, on } from '@ngrx/store';
import { setUser, unSetUser } from './auth.actions';

export interface State {
  user: User;
}
export const initialState: State = {
  user: null,
};
const authReducer = createReducer(
  initialState,
  on(setUser, (state, { user }) => ({ ...state, user: { ...user } })),
  on(unSetUser, (state) => ({ ...state, user: null }))
);
export function AuthReducer(state, action) {
  return authReducer(state, action);
}
