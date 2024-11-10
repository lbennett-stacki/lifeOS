export const lowercaseFirst = (input: string) => {
  const first = input.charAt(0).toLowerCase();
  const rest = input.slice(1);

  return [first, rest].join('');
};

export const uppercaseFirst = (input: string) => {
  const first = input.charAt(0).toUpperCase();
  const rest = input.slice(1);

  return [first, rest].join('');
};

export const toPascalCase = (input: string) => {
  const words = input.split(/[-_ ]/);

  const pascalCase = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  return pascalCase.join('');
};
