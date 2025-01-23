import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectComponent } from '../../../../components/select.component';
import { MonthType, OptionItem } from '../../../../types';
import { MonthRangeForm } from '../../../../types/forms';
import { MONTHS } from '../../../../utils/constant';

@Component({
  selector: 'app-filter-bar',
  imports: [SelectComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarComponent {
  monthOptions: OptionItem[] = MONTHS.map((month) => ({ label: month, value: month }));
  monthRangeForm = new FormGroup<MonthRangeForm>({
    startMonth: new FormControl<MonthType>('January', { nonNullable: true }),
    endMonth: new FormControl<MonthType>('December', { nonNullable: true }),
  });

  constructor() {
    this.monthRangeForm.valueChanges.subscribe((value) => {
      console.log(value);
    });
  }
}
