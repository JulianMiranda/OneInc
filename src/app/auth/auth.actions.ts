import { User } from './../models/user.model';
import { createAction, props } from '@ngrx/store';

export const setUser = createAction('[Auth] setUser', props<{ user: User }>());
export const unSetUser = createAction('[Auth] unSetUser');
