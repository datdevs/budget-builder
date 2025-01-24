import { Pipe, PipeTransform } from '@angular/core';
import { BudgetCategory } from '../../types';
import { calculateCategorySum } from '../index';

@Pipe({
  name: 'subTotalCalculate',
  pure: false,
})
export class SubTotalCalculatePipe implements PipeTransform {
  transform(value: BudgetCategory, month: string): number {
    // Calculate the sum of a category
    return calculateCategorySum(value, month);
  }
}
