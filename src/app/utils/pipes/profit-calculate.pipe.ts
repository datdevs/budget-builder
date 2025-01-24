import { Pipe, PipeTransform } from '@angular/core';
import { BudgetModel } from '../../types';
import { calculateCategorySum } from '../index';

@Pipe({
  name: 'profitCalculate',
  pure: false,
})
export class ProfitCalculatePipe implements PipeTransform {
  transform(value: BudgetModel, month: string): number {
    let result = 0;

    // Calculate the sum of a category
    result += value.income.reduce((acc, category) => acc + calculateCategorySum(category, month), 0);
    result -= value.expenses.reduce((acc, category) => acc + calculateCategorySum(category, month), 0);

    return result;
  }
}
