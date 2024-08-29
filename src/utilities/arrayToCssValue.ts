export const arrayToCssValue = (
  arr: number[] | undefined,
  unit: string
): string => {
  if (!arr || arr.length === 0) return "0";
  return arr.map((value) => `${value}${unit}`).join(" ");
};
