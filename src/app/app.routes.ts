import { Routes } from '@angular/router';
import { BudgetDataService, BudgetFilterService } from './features/budget-calculator/services';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    providers: [BudgetFilterService, BudgetDataService],
    loadComponent: async () =>
      (await import('./features/budget-calculator/budget-calculator.component')).BudgetCalculatorComponent,
  },
];
