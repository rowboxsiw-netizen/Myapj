import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { ref, push, set, onValue, remove } from 'firebase/database';
import { Observable } from 'rxjs';
import { ApiKey } from '../interfaces/api-key.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private firebaseService = inject(FirebaseService);
  private authService = inject(AuthService);

  generateApiKey(name: string, permissions: string[], expiresAt: string | null): Promise<void> {
    const newKeyRef = push(ref(this.firebaseService.database, 'apiKeys'));
    const newKey = {
      id: newKeyRef.key,
      key: this.generateRandomKey(),
      name,
      permissions,
      expiresAt,
      createdAt: new Date().toISOString(),
      createdBy: this.authService.currentUserSubject.value?.email,
      isActive: true,
    };
    return set(newKeyRef, newKey);
  }

  getApiKeys(): Observable<ApiKey[]> {
    const keysRef = ref(this.firebaseService.database, 'apiKeys');
    return new Observable(observer => {
      onValue(keysRef, (snapshot) => {
        const keysData = snapshot.val();
        const keysList: ApiKey[] = keysData ? Object.values(keysData) : [];
        observer.next(keysList);
      }, (error) => {
        observer.error(error);
      });
    });
  }
  
  revokeApiKey(keyId: string): Promise<void> {
    const keyRef = ref(this.firebaseService.database, `apiKeys/${keyId}`);
    return remove(keyRef);
  }

  private generateRandomKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'fk_'; // Firebase Key prefix
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  }
}
