import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import Iuser from '../models/user.model';
import { Observable, filter, of } from 'rxjs';
import { map, delay, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usersCollection: AngularFirestoreCollection<Iuser>
  public isAuthenticated$: Observable<boolean>
  public isAuthenticatedWithDelay$: Observable<boolean>
  private isRedirect?: boolean
  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usersCollection = this.db.collection<Iuser>('Users')
    this.isAuthenticated$ = this.auth.user.pipe(
      map(user => !!user)
    )
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1200)
    )

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => this.route.firstChild),
      switchMap(route => route?.data ?? of({}))
    ).subscribe(data => this.isRedirect = data.requiresAuth ?? false)

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

  public async logout($event: Event) {
    $event.preventDefault()
    await this.auth.signOut()
    if (this.isRedirect) {
      this.router.navigateByUrl('/')
    }
  }


}
