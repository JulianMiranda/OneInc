import { User } from './../models/user.model';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSubscription: Subscription;
  private userP: User;

  get user() {
    return this.userP;
  }

  constructor(
    public auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>
  ) {}

  initAuthListener() {
    this.auth.authState.subscribe((fUser) => {
      if (fUser) {
        this.userSubscription = this.firestore
          .doc(`${fUser.uid}/user`)
          .valueChanges()
          .subscribe((fsUser: any) => {
            const user = User.fromFireStore(fsUser);
            this.userP = user;
            this.store.dispatch(authActions.setUser({ user }));
          });
      } else {
        this.userP = null;
        this.userSubscription.unsubscribe();
        this.store.dispatch(authActions.unSetUser());
      }
    });
  }

  createUser(name: string, email: string, password: string) {
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const newUser = new User(user.uid, name, user.email);
        return this.firestore.doc(`${user.uid}/user`).set({ ...newUser });
      });
  }
  loginUser(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }
  logout() {
    return this.auth.signOut();
  }
  isAuth() {
    return this.auth.authState.pipe(map((fbUser) => fbUser != null));
  }
}
