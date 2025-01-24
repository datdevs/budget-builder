export type BudgetCategory = Category & {
  children: BudgetSubCategory[];
};

export type BudgetSubCategory = Category;

export type BudgetModel = {
  income: BudgetCategory[];
  expenses: BudgetCategory[];
};

type Category = {
  id: string;
  name: string;
  values: Record<string, number>;
};
