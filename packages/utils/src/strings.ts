export const lowercaseFirst = (input: string) => {
  const first = input.charAt(0).toLowerCase();
  const rest = input.slice(1);

  return `${first}${rest}`;
};
