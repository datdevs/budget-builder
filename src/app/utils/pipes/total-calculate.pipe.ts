import { Pipe, PipeTransform } from '@angular/core';
import { BudgetCategory } from '../../types';
import { calculateCategorySum } from '../index';

@Pipe({
  name: 'totalCalculate',
  pure: false,
})
export class TotalCalculatePipe implements PipeTransform {
  transform(value: BudgetCategory[], month: string): number {
    let result = 0;

    // Calculate the sum of a category
    result = value.reduce((acc, category) => acc + calculateCategorySum(category, month), 0);

    return result;
  }
}
