import { Component, ChangeDetectionStrategy, inject, ViewChild, ElementRef, afterNextRender } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from '../../../services/user.service';
import { AnalyticsService } from '../../../services/analytics.service';
declare var Chart: any;

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './statistics.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsComponent {
  private userService = inject(UserService);
  private analyticsService = inject(AnalyticsService);

  @ViewChild('registrationChart') registrationChart!: ElementRef<HTMLCanvasElement>;
  private chartInstance: any;

  userCount$: Observable<number> = this.userService.getUserCount();
  dailyRegistrations$ = this.analyticsService.getDailyRegistrations().pipe(
    tap(data => this.createOrUpdateChart(data))
  );

  constructor() {
    afterNextRender(() => {
        // This is needed to ensure the canvas is rendered before chart creation
    });
  }

  createOrUpdateChart(data: { labels: string[], data: number[] }) {
    if (!this.registrationChart?.nativeElement) {
      setTimeout(() => this.createOrUpdateChart(data), 50);
      return;
    };
    
    const context = this.registrationChart.nativeElement.getContext('2d');
    if (!context) return;

    if (this.chartInstance) {
      this.chartInstance.data.labels = data.labels;
      this.chartInstance.data.datasets[0].data = data.data;
      this.chartInstance.update();
    } else {
      this.chartInstance = new Chart(context, {
        type: 'pie',
        data: {
          labels: data.labels,
          datasets: [{
            label: 'Daily Registrations',
            data: data.data,
            backgroundColor: [
              'rgba(59, 130, 246, 0.5)',
              'rgba(239, 68, 68, 0.5)',
              'rgba(245, 158, 11, 0.5)',
              'rgba(16, 185, 129, 0.5)',
              'rgba(139, 92, 246, 0.5)',
              'rgba(236, 72, 153, 0.5)',
            ],
            borderColor: [
              'rgba(59, 130, 246, 1)',
              'rgba(239, 68, 68, 1)',
              'rgba(245, 158, 11, 1)',
              'rgba(16, 185, 129, 1)',
              'rgba(139, 92, 246, 1)',
              'rgba(236, 72, 153, 1)',
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Registrations by Day'
            }
          }
        },
      });
    }
  }
}
