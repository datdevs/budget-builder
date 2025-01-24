export const calculateCategorySum = (category: any, month: string): number => {
  let sum = category.values[month];

  category.children.forEach((child: any) => {
    sum += child.values[month];
  });

  return sum;
};
