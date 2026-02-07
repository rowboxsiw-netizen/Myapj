import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { ref, onValue, get } from 'firebase/database';
import { Observable } from 'rxjs';
import { AppUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firebaseService = inject(FirebaseService);

  getUsers(): Observable<AppUser[]> {
    const usersRef = ref(this.firebaseService.database, 'users');
    return new Observable(observer => {
      onValue(usersRef, (snapshot) => {
        const usersData = snapshot.val();
        const usersList: AppUser[] = usersData ? Object.values(usersData) : [];
        observer.next(usersList);
      }, (error) => {
        observer.error(error);
      });
    });
  }

  getUserCount(): Observable<number> {
    const usersRef = ref(this.firebaseService.database, 'users');
    return new Observable(observer => {
        onValue(usersRef, (snapshot) => {
            observer.next(snapshot.size);
        });
    });
  }
}
