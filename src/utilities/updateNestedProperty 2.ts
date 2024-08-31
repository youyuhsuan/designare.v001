// 遞歸遍歷嵌套對象的屬性路徑
export const updateNestedProperty = (
  obj: any,
  path: string[],
  value: any
): any => {
  const [head, ...rest] = path;
  if (rest.length === 0) {
    return { ...obj, [head]: value };
  }
  return {
    ...obj,
    [head]: updateNestedProperty(obj[head] || {}, rest, value),
  };
};
