import { BudgetModel, MonthRange } from '../../types';

type StorageObjectMap = {
  monthRange: MonthRange;
  budget: BudgetModel;
};

export type StorageObjectType = keyof StorageObjectMap;

export type StorageObjectData<T extends StorageObjectType> = {
  type: T;
  data: StorageObjectMap[T];
};
