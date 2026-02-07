import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLoginComponent {
  loginForm = this.fb.group({
    email: ['rowboxsiw@gmail.com', [Validators.required, Validators.email]],
    password: ['ABC13792588@MRK', Validators.required],
  });
  
  status = signal<'idle' | 'loading' | 'error'>('idle');
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.status.set('loading');
    this.errorMessage.set(null);
    try {
      await this.authService.loginAdmin(this.loginForm.value);
      this.router.navigate(['/admin/dashboard']);
    } catch (error: any) {
      this.status.set('error');
      this.errorMessage.set(error.message || 'Failed to login.');
    }
  }
}
