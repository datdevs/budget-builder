import { Pipe, PipeTransform } from '@angular/core';
import { BudgetModel } from '../../types';
import { calculateCategorySum } from '../index';

@Pipe({
  name: 'balanceCalculator',
  pure: false,
})
export class BalanceCalculatorPipe implements PipeTransform {
  transform(
    value: BudgetModel,
    currentMonth: string,
    months: { localeString: string; isoString: string }[],
    isCloseBalance?: boolean,
  ): unknown {
    const monthList = months.map((month) => month.isoString);
    const currentMonthIndex = monthList.indexOf(currentMonth);

    if (currentMonthIndex === -1) {
      // If the current month is not found, return 0
      return 0;
    }

    const previousMonth = monthList[currentMonthIndex - 1];
    let previousCloseBalance = 0;
    let profit = 0;

    // Calculate the balance for a category
    const calculateCategoryBalance = (categories: any[], month: string): number => {
      return categories.reduce((acc, category) => acc + calculateCategorySum(category, month), 0);
    };

    if (previousMonth) {
      // Calculate previous close balance
      previousCloseBalance =
        calculateCategoryBalance(value.income, previousMonth) - calculateCategoryBalance(value.expenses, previousMonth);
    }

    if (isCloseBalance) {
      // Calculate profit (income - expenses) for the current month
      profit =
        calculateCategoryBalance(value.income, currentMonth) - calculateCategoryBalance(value.expenses, currentMonth);

      // Return previous close balance + profit
      return previousCloseBalance + profit;
    } else {
      // Return previous close balance
      return previousCloseBalance;
    }
  }
}
