export class User {
  static fromFireStore({ name, email, uid }) {
    return new User(uid, name, email);
  }
  constructor(public uid: string, public name: string, public email: string) {}
}
