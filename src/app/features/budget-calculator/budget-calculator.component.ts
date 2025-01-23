import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BudgetTableComponent } from './components/budget-table/budget-table.component';
import { FilterBarComponent } from './components/filter-bar/filter-bar.component';

@Component({
  selector: 'app-budget-calculator',
  imports: [FilterBarComponent, BudgetTableComponent],
  templateUrl: './budget-calculator.component.html',
  styleUrl: './budget-calculator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetCalculatorComponent {}
