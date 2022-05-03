import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import Iuser from '../models/user.model';
import { Observable } from 'rxjs';
import { map ,delay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usersCollection: AngularFirestoreCollection<Iuser>
  public isAuthenticated$: Observable<boolean>
  public isAuthenticatedWithDelay$: Observable<boolean>

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore
  ) {
    this.usersCollection = this.db.collection<Iuser>('Users')
    this.isAuthenticated$ = this.auth.user.pipe(
      map(user => !!user)
    )
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(2000)
    )
  }

  public async createuser(userData: Iuser) {


    if (!userData.password) {
      throw new Error("Password Empty")
    }
    const userCred = await this.auth.createUserWithEmailAndPassword(userData.email, userData.password)

    if (!this.usersCollection) {
      throw new Error('Firestore Connection not yet established')
    }

    if (!userCred.user) {
      throw new Error('User not found')
    }

    await this.usersCollection.doc(userCred.user.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber
    })

    await userCred.user.updateProfile({
      displayName: userData.name
    })
  }


}
