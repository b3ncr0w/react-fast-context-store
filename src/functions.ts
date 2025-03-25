export const cloneDeep = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};

export const isEqual = (a: any, b: any) => {
  return JSON.stringify(a) === JSON.stringify(b);
};