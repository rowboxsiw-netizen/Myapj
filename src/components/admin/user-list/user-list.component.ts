import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserService } from '../../../services/user.service';
import { AppUser } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  private userService = inject(UserService);
  
  users = toSignal<AppUser[], AppUser[]>(this.userService.getUsers(), { initialValue: [] });
  searchTerm = signal('');

  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      return this.users();
    }
    return this.users().filter(user => 
      user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
    );
  });
  
  onSearch(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  exportTo(format: 'csv' | 'json') {
    const data = this.filteredUsers();
    const filename = `users-${new Date().toISOString()}`;
    if (format === 'json') {
      const jsonStr = JSON.stringify(data, null, 2);
      this.download(jsonStr, `${filename}.json`, 'application/json');
    } else if (format === 'csv') {
      const headers = ['UID', 'Name', 'Email', 'Phone', 'Created At', 'Verified'];
      const csvRows = [
        headers.join(','),
        ...data.map(u => [u.uid, u.name, u.email, u.phone, u.createdAt, u.isVerified].join(','))
      ];
      this.download(csvRows.join('\n'), `${filename}.csv`, 'text/csv');
    }
  }

  private download(content: string, fileName: string, contentType: string) {
    const a = document.createElement('a');
    const blob = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  }
}
