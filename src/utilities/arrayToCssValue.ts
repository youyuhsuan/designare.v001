export const arrayToCssValue = (arr: number[], unit: string): string => {
  return arr.map((value) => `${value}${unit}`).join(" ");
};
