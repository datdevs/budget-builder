import { Routes } from '@angular/router';
import { BudgetService } from './features/budget-calculator/services';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    providers: [BudgetService],
    loadComponent: async () =>
      (await import('./features/budget-calculator/budget-calculator.component')).BudgetCalculatorComponent,
  },
];
