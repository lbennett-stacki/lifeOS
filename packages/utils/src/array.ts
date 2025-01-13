export const arrayify = <I, R = I extends Array<infer Item> ? Item[] : I[]>(
  input: I,
): R => {
  const result = Array.isArray(input) ? input : [input];

  return result as R;
};
