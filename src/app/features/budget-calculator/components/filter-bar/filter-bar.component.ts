import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../components/button/button.component';
import { DatetimePickerComponent } from '../../../../components/datetime-picker/datetime-picker.component';
import { MonthRangeForm } from '../../../../types/forms';
import { CARD } from '../../../../utils/tailwindcss';
import { BudgetFilterService } from '../../services';

@Component({
  selector: 'app-filter-bar',
  imports: [FormsModule, ReactiveFormsModule, DatetimePickerComponent, ButtonComponent],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarComponent {
  cssCard = CARD;

  monthRangeForm = new FormGroup<MonthRangeForm>({
    startMonth: new FormControl<string>('', { nonNullable: true }),
    endMonth: new FormControl<string>('', { nonNullable: true }),
  });

  private readonly budgetService = inject(BudgetFilterService);

  constructor() {
    this.monthRangeForm.patchValue(this.budgetService.getMonthRange());
  }

  applyMonthRange(): void {
    this.budgetService.setMonthRange(this.monthRangeForm.getRawValue());
  }
}
