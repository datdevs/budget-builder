import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: async () =>
      (await import('./features/budget-calculator/budget-calculator.component')).BudgetCalculatorComponent,
  },
];
