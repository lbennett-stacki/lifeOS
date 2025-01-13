import { ZodIssue } from 'zod';

export const formatErrors = (errors: ZodIssue[]) => {
  return errors
    .map((error) => `  * ${error.path.join('.')} - ${error.message}`)
    .join('\n');
};
