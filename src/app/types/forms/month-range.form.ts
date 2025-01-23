import { FormControl } from '@angular/forms';
import { MonthType } from '../month';

export type MonthRangeForm = {
  startMonth: FormControl<MonthType>;
  endMonth: FormControl<MonthType>;
};
