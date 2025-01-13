import { lowercaseFirst } from '@lifeos/utils';
import { ExtendableLogger, createLogger } from './logger.js';
import { LoggerNamespaceType, Namespaces } from './namespaces.js';

export const createLoggerFacade = () => {
  const namespaceTypes = Object.entries(LoggerNamespaceType);

  const facade: Partial<ExtendableLogger> = {};
  for (const [name, type] of namespaceTypes) {
    facade[lowercaseFirst(name)] = (namespace: string) => {
      return createLogger(type, namespace, new Namespaces());
    };
  }

  return facade as ExtendableLogger;
};

export const logger = createLoggerFacade();
