import { z, ZodType } from 'zod';
import { Logger } from '@lifeos/logger';
import { formatErrors } from './errors.js';

export const parseConfig = <S extends ZodType>(
  {
    namespace,
    schema,
    logger,
  }: { namespace: string; schema: S; logger: Logger },
  input: unknown,
): z.infer<S> => {
  const result = schema.safeParse(input);

  const log = logger.package('config').function('parseConfig');

  if (!result.success) {
    log.error(
      `${namespace} config parsing error!\n${formatErrors(result.error.errors)}`,
    );
    process.exit(1);
  }

  return result.data;
};
