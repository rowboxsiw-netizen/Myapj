import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  sendEmailVerification
} from 'firebase/auth';
import { set, ref } from 'firebase/database';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firebaseService = inject(FirebaseService);
  private router = inject(Router);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    onAuthStateChanged(this.firebaseService.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  async registerUser(userData: any) {
    const { email, password, fullName, phone } = userData;
    const userCredential = await createUserWithEmailAndPassword(this.firebaseService.auth, email, password);
    const user = userCredential.user;
    
    await set(ref(this.firebaseService.database, 'users/' + user.uid), {
      name: fullName,
      email: email,
      phone: phone,
      createdAt: new Date().toISOString(),
      isVerified: false,
      uid: user.uid
    });

    await sendEmailVerification(user);

    return userCredential;
  }

  async loginAdmin(credentials: any) {
      if(credentials.email !== 'rowboxsiw@gmail.com') {
          throw new Error('Invalid admin credentials.');
      }
      return signInWithEmailAndPassword(this.firebaseService.auth, credentials.email, credentials.password);
  }

  async logout() {
    await signOut(this.firebaseService.auth);
    this.router.navigate(['/admin/login']);
  }
}
