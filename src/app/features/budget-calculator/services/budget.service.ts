import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { MonthRange } from '../../../types';
import { storage } from '../../../utils/storage/storage.utils';

@Injectable()
export class BudgetService {
  private monthRange: WritableSignal<MonthRange> = signal<MonthRange>({
    startMonth: storage.getItem('monthRange')?.startMonth || '2024-01',
    endMonth: storage.getItem('monthRange')?.endMonth || '2024-12',
  });
  getMonthRange = computed(() => this.monthRange());

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
