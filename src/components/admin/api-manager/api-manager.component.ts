import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../../../services/api.service';
import { ApiKey } from '../../../interfaces/api-key.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-api-manager',
  standalone: true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule],
  templateUrl: './api-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiManagerComponent {
  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);

  apiKeys = toSignal<ApiKey[], ApiKey[]>(this.apiService.getApiKeys(), { initialValue: [] });
  showForm = signal(false);
  
  apiKeyForm = this.fb.group({
    name: ['', Validators.required],
    permissions: ['read-only', Validators.required],
    expiresAt: ['']
  });

  async createApiKey() {
    if (this.apiKeyForm.invalid) return;
    const formValue = this.apiKeyForm.value;
    const permissions = formValue.permissions === 'read-only' ? ['read:users'] : ['read:users', 'write:users'];
    await this.apiService.generateApiKey(formValue.name!, permissions, formValue.expiresAt || null);
    this.apiKeyForm.reset({ permissions: 'read-only' });
    this.showForm.set(false);
  }

  async revokeKey(keyId: string) {
    if (confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      await this.apiService.revokeApiKey(keyId);
    }
  }
}
