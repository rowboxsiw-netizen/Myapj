import { Routes } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { authGuard } from './guards/auth.guard';
import { UserListComponent } from './components/admin/user-list/user-list.component';
import { StatisticsComponent } from './components/admin/statistics/statistics.component';
import { ApiManagerComponent } from './components/admin/api-manager/api-manager.component';
import { ApiDocsComponent } from './components/api-docs/api-docs.component';

export const APP_ROUTES: Routes = [
  { path: 'register', component: RegistrationComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'api-docs', component: ApiDocsComponent },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'statistics', pathMatch: 'full' },
      { path: 'statistics', component: StatisticsComponent },
      { path: 'users', component: UserListComponent },
      { path: 'api-keys', component: ApiManagerComponent },
    ]
  },
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  { path: '**', redirectTo: '/register' }
];
