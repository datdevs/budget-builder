import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../components/button/button.component';
import { DatetimePickerComponent } from '../../../../components/datetime-picker/datetime-picker.component';
import { MonthRangeForm } from '../../../../types/forms';
import { CARD } from '../../../../utils/tailwindcss';

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
    startMonth: new FormControl<string>('2024-01', { nonNullable: true }),
    endMonth: new FormControl<string>('2024-12', { nonNullable: true }),
  });

  constructor() {
    this.monthRangeForm.valueChanges.subscribe((value) => {
      console.log(value);
    });
  }
}
