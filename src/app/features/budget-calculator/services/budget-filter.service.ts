import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { MonthRange } from '../../../types';
import { storage } from '../../../utils/storage/storage.utils';

@Injectable()
export class BudgetFilterService {
  private monthRange: WritableSignal<MonthRange> = signal<MonthRange>({
    startMonth: storage.getItem('monthRange')?.startMonth || '2024-01',
    endMonth: storage.getItem('monthRange')?.endMonth || '2024-12',
  });
  getMonthRange = computed(() => this.monthRange());

  monthCollection = computed(() => {
    const { startMonth, endMonth } = this.monthRange();
    const start = new Date(startMonth);
    const end = new Date(endMonth);
    const months: {
      localeString: string;
      isoString: string;
    }[] = [];

    for (let i = start; i <= end; i.setMonth(i.getMonth() + 1)) {
      months.push({
        localeString: i.toLocaleString('default', { month: 'long', year: 'numeric' }),
        isoString: i.toISOString().slice(0, 7),
      });
    }

    return months;
  });

  constructor() {
    if (!storage.getItem('monthRange')) {
      this.setMonthRange(this.monthRange());
    }
  }

  setMonthRange(monthRange: MonthRange) {
    this.monthRange.set(monthRange);
    storage.setItem('monthRange', monthRange);
  }
}
