import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private userService = inject(UserService);

  getDailyRegistrations() {
    return this.userService.getUsers().pipe(
      map(users => {
        const registrationCounts: { [key: string]: number } = {};
        users.forEach(user => {
          if (user.createdAt) {
            const date = new Date(user.createdAt).toISOString().split('T')[0];
            registrationCounts[date] = (registrationCounts[date] || 0) + 1;
          }
        });
        
        const labels = Object.keys(registrationCounts).sort();
        const data = labels.map(label => registrationCounts[label]);

        return { labels, data };
      })
    );
  }
}
