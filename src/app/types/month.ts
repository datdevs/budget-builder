import { MONTHS } from '../utils/constant';

export type MonthType = (typeof MONTHS)[number];

export type MonthRange = {
  startMonth: string;
  endMonth: string;
};
