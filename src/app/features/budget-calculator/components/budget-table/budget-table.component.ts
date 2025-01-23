import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CARD } from '../../../../utils/tailwindcss';

@Component({
  selector: 'app-budget-table',
  imports: [],
  templateUrl: './budget-table.component.html',
  styleUrl: './budget-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetTableComponent {
  cssCard = CARD;
}
