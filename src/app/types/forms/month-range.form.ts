import { FormControl } from '@angular/forms';

export type MonthRangeForm = {
  startMonth: FormControl<string>;
  endMonth: FormControl<string>;
};
