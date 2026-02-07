import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-strength',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './password-strength.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordStrengthComponent {
  password = input<string>('');
  
  strength = computed(() => {
    const p = this.password();
    let score = 0;
    if (!p) {
      return 0;
    }
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  });

  strengthLabel = computed(() => {
    const s = this.strength();
    if (s <= 2) return 'Weak';
    if (s <= 4) return 'Medium';
    return 'Strong';
  });

  strengthColor = computed(() => {
    const s = this.strength();
    if (s <= 2) return 'bg-red-500';
    if (s <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  });
}
