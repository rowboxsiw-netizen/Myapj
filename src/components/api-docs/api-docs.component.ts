import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-api-docs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './api-docs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiDocsComponent {
  databaseURL = "https://public-fic-default-rtdb.firebaseio.com";
  selectedLang = signal('javascript');

  selectLang(lang: string) {
    this.selectedLang.set(lang);
  }
}
