import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { Payment } from '../models/payment.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}
  createPayment(payment: Payment) {
    const uid = this.authService.user.uid;
    delete payment.uid;
    return this.firestore
      .doc(`${uid}/payments`)
      .collection('items')
      .add({ ...payment });
  }
  initPaymentListener(uid: string) {
    return this.firestore
      .collection(`${uid}/payments/items`)
      .snapshotChanges()
      .pipe(
        map((snapshot) => {
          return snapshot.map((doc) => {
            return {
              uid: doc.payload.doc.id,
              ...(doc.payload.doc.data() as any),
            };
          });
        })
      );
  }
  get(uidItem: string) {
    const uid = this.authService.user.uid;
    return this.firestore.doc(`${uid}/payments/items/${uidItem}`).get();
  }
  editPayment(payment: Payment, uidItem: string) {
    const uid = this.authService.user.uid;
    delete payment.uid;
    return this.firestore
      .doc(`${uid}/payments/items/${uidItem}`)
      .update({ ...payment });
  }
  deletePayment(uidItem: string) {
    const uid = this.authService.user.uid;
    return this.firestore.doc(`${uid}/payments/items/${uidItem}`).delete();
  }
}
