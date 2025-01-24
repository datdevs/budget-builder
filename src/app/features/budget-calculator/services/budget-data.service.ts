import { computed, Injectable, signal } from '@angular/core';
import { v7 as uuid } from 'uuid';

import { BudgetModel } from '../../../types';
import { storage } from '../../../utils/storage/storage.utils';

@Injectable()
export class BudgetDataService {
  private budget = signal<BudgetModel>(storage.getItem('budget') || { income: [], expenses: [] });
  getBudget = computed(() => this.budget());

  /**
   * Add a category to the budget
   * @param type
   * @param months
   */
  addCategory(type: 'income' | 'expenses', months: string[]) {
    this._updateBudget(() => {
      this._getCategory(type).push({
        id: uuid(),
        name: '',
        children: [],
        values: months.reduce((acc, month) => ({ ...acc, [month]: 0 }), {}),
      });
    });
  }

  /**
   * Update a category in the budget
   * @param type
   * @param categoryId
   * @param name
   */
  updateCategory(type: 'income' | 'expenses', categoryId: string, name: string) {
    this._updateBudget(() => {
      const category = this._findCategory(type, categoryId);
      if (category) category.name = name;
    });
  }

  /**
   * Update the value of a category in the budget
   * @param type
   * @param categoryId
   * @param month
   * @param value
   */
  updateCategoryValue(type: 'income' | 'expenses', categoryId: string, month: string, value: number) {
    this._updateBudget(() => {
      const category = this._findCategory(type, categoryId);
      if (category) category.values[month] = value;
    });
  }

  /**
   * Delete a category from the budget
   * @param type
   * @param categoryId
   */
  deleteCategory(type: 'income' | 'expenses', categoryId: string) {
    this._updateBudget(() => {
      this.budget()[type] = this._getCategory(type).filter((cat) => cat.id !== categoryId);
    });
  }

  /**
   * Add a sub category to the budget
   * @param type
   * @param categoryId
   * @param months
   */
  addSubCategory(type: 'income' | 'expenses', categoryId: string, months: string[]) {
    this._updateBudget(() => {
      const category = this._findCategory(type, categoryId);
      if (category) {
        category.children.push({
          id: uuid(),
          name: '',
          values: months.reduce((acc, month) => ({ ...acc, [month]: 0 }), {}),
        });
      }
    });
  }

  /**
   * Update a sub category in the budget
   * @param type
   * @param categoryId
   * @param subCategoryId
   * @param name
   */
  updateSubCategory(type: 'income' | 'expenses', categoryId: string, subCategoryId: string, name: string) {
    this._updateBudget(() => {
      const subCategory = this._findSubCategory(type, categoryId, subCategoryId);
      if (subCategory) subCategory.name = name;
    });
  }

  /**
   * Update the value of a sub category in the budget
   * @param type
   * @param categoryId
   * @param subCategoryId
   * @param month
   * @param value
   */
  updateSubCategoryValue(
    type: 'income' | 'expenses',
    categoryId: string,
    subCategoryId: string,
    month: string,
    value: number,
  ) {
    this._updateBudget(() => {
      const subCategory = this._findSubCategory(type, categoryId, subCategoryId);
      if (subCategory) subCategory.values[month] = value;
    });
  }

  /**
   * Delete a sub category from the budget
   * @param type
   * @param categoryId
   * @param subCategoryId
   */
  deleteSubCategory(type: 'income' | 'expenses', categoryId: string, subCategoryId: string) {
    this._updateBudget(() => {
      const category = this._findCategory(type, categoryId);
      if (category) {
        category.children = category.children.filter((sub) => sub.id !== subCategoryId);
      }
    });
  }

  /**
   * Copy the value of a category to all after months
   * @param type
   * @param categoryId
   * @param subCategoryId
   * @param month
   */
  copyValueToAllAfterMonths(
    type: 'income' | 'expenses',
    categoryId: string,
    subCategoryId: string | null,
    month: string,
  ) {
    this._updateBudget(() => {
      const category = this._findCategory(type, categoryId);

      if (!category) return;

      if (!subCategoryId) {
        const months = Object.keys(category.values);
        const monthIndex = months.indexOf(month);
        const value = category.values[month];
        for (let i = monthIndex + 1; i < months.length; i++) {
          category.values[months[i]] = value;
        }
      } else {
        const subCategory = this._findSubCategory(type, categoryId, subCategoryId);

        if (category && subCategory) {
          const months = Object.keys(subCategory.values);
          const monthIndex = months.indexOf(month);
          const value = subCategory.values[month];
          for (let i = monthIndex + 1; i < months.length; i++) {
            subCategory.values[months[i]] = value;
          }
        }
      }
    });
  }

  /**
   * Update the months of the budget
   * @param months
   */
  updateBudgetMonths(months: string[]) {
    this._updateBudget(() => {
      const budget = this.budget();
      budget.income.forEach((category) => {
        category.values = months.reduce((acc, month) => ({ ...acc, [month]: category.values[month] || 0 }), {});
        category.children.forEach((subCategory) => {
          subCategory.values = months.reduce((acc, month) => ({ ...acc, [month]: subCategory.values[month] || 0 }), {});
        });
      });
      budget.expenses.forEach((category) => {
        category.values = months.reduce((acc, month) => ({ ...acc, [month]: category.values[month] || 0 }), {});
        category.children.forEach((subCategory) => {
          subCategory.values = months.reduce((acc, month) => ({ ...acc, [month]: subCategory.values[month] || 0 }), {});
        });
      });
    });
  }

  /**
   * Save the current budget to local storage
   * @private
   */
  private _saveBudget() {
    storage.setItem('budget', this.budget());
  }

  /**
   * Get the category of the budget
   * @param type
   * @private
   */
  private _getCategory(type: 'income' | 'expenses') {
    return this.budget()[type];
  }

  /**
   * Find a category in the budget
   * @param type
   * @param categoryId
   * @private
   */
  private _findCategory(type: 'income' | 'expenses', categoryId: string) {
    return this._getCategory(type).find((cat) => cat.id === categoryId);
  }

  /**
   * Find a sub category in the budget
   * @param type
   * @param categoryId
   * @param subCategoryId
   * @private
   */
  private _findSubCategory(type: 'income' | 'expenses', categoryId: string, subCategoryId: string) {
    return this._findCategory(type, categoryId)?.children.find((sub) => sub.id === subCategoryId);
  }

  /**
   * Update the budget
   * @param updateFn
   * @private
   */
  private _updateBudget(updateFn: () => void) {
    updateFn();
    this.budget.set(this.budget());
    this._saveBudget();
  }
}
