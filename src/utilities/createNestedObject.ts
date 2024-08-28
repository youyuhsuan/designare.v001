export const createNestedObject = (path: string[], value: any) => {
  const result: any = {};
  let current = result;
  for (let i = 0; i < path.length - 1; i++) {
    current[path[i]] = {};
    current = current[path[i]];
  }
  current[path[path.length - 1]] = value;
  return result;
};
