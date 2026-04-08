import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  // ✅ Default route → Login page
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Auth
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component')
        .then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./components/signup/signup.component')
        .then((m) => m.SignupComponent),
  },

  // 🔒 Protected Routes (ALL require login)

  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component')
        .then((m) => m.HomeComponent),
    canActivate: [authGuard],
  },

  {
    path: 'services',
    loadComponent: () =>
      import('./components/services/services.component')
        .then((m) => m.ServicesComponent),
    canActivate: [authGuard],
  },

  {
    path: 'departments',
    loadComponent: () =>
      import('./components/departments/departments.component')
        .then((m) => m.DepartmentsComponent),
    canActivate: [authGuard],
  },

  {
    path: 'emergency',
    loadComponent: () =>
      import('./components/emergency/emergency.component')
        .then((m) => m.EmergencyComponent),
    canActivate: [authGuard],
  },

  {
    path: 'nearby-hospitals',
    loadComponent: () =>
      import('./components/hospitals/all-hospitals/all-hospitals.component')
        .then((m) => m.AllHospitalsComponent),
    canActivate: [authGuard],
  },

  {
    path: 'hospital-details',
    loadComponent: () =>
      import('./components/hospitals/hospital-details/hospital-details.component')
        .then((m) => m.HospitalDetailsComponent),
    canActivate: [authGuard],
  },

  {
    path: 'all-hospitals',
    loadComponent: () =>
      import('./components/hospitals/all-hospitals/all-hospitals.component')
        .then((m) => m.AllHospitalsComponent),
    canActivate: [authGuard],
  },

  {
    path: 'find-doctors',
    loadComponent: () =>
      import('./pages/find-doctors/find-doctors.component')
        .then((m) => m.FindDoctorsComponent),
    canActivate: [authGuard],
  },

  {
    path: 'health-profile',
    loadComponent: () =>
      import('./pages/health-profile/health-profile.component')
        .then((m) => m.HealthProfileComponent),
    canActivate: [authGuard],
  },

  {
    path: 'symptom-checker',
    loadComponent: () =>
      import('./pages/symptom-checker/symptom-checker.component')
        .then((m) => m.SymptomCheckerComponent),
    canActivate: [authGuard],
  },

  {
    path: 'emergencies',
    loadComponent: () =>
      import('./pages/emergencies/emergencies.component')
        .then((m) => m.EmergencyComponent),
    canActivate: [authGuard],
  },

  {
    path: 'multi-language',
    loadComponent: () =>
      import('./pages/multi-language/multi-language.component')
        .then((m) => m.MultiLanguageComponent),
    canActivate: [authGuard],
  },

  {
    path: 'department/:departmentRoute',
    loadComponent: () =>
      import('./pages/departments/department-doctors/department-doctors.component')
        .then((m) => m.DepartmentDoctorsComponent),
    canActivate: [authGuard],
  },

  {
    path: 'health-tip-details/:id',
    loadComponent: () =>
      import('./pages/health-tip-details/health-tip-details.component')
        .then((m) => m.HealthTipDetailsComponent),
    canActivate: [authGuard],
  },

  {
    path: 'ai-chatbot',
    loadComponent: () =>
      import('./pages/chatbot1/chatbot1.component')
        .then((m) => m.ChatbotComponent),
    canActivate: [authGuard],
  },


  // Wildcard
  {
    path: '**',
    redirectTo: 'login',
  },
];

