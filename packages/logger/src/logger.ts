import { lowercaseFirst } from '@lifeos/utils';
import { LoggerNamespaceType, Namespaces } from './namespaces.js';
import { LoggerLevel } from './level.js';
import { BaseLogger } from './base.js';
import { nativeConsole } from './native.js';

export type LoggerConsole = Record<
  Uncapitalize<keyof typeof LoggerLevel>,
  (...messages: unknown[]) => Logger
>;

export type ExtendableLogger = Record<
  Uncapitalize<keyof typeof LoggerNamespaceType>,
  (namespace: string) => Logger
>;

export type Logger = BaseLogger & LoggerConsole & ExtendableLogger;

const createExtendableLogger = (logger: BaseLogger) => {
  const namespaceTypes = Object.entries(LoggerNamespaceType);
  const extendableLogger: Partial<ExtendableLogger> = {};
  for (const [name, type] of namespaceTypes) {
    const methodName = lowercaseFirst(name);
    extendableLogger[methodName] = (namespace: string) => {
      return logger.extend(type, namespace);
    };
  }

  return extendableLogger as ExtendableLogger;
};

const createLoggerConsole = (logger: BaseLogger) => {
  const levels = Object.entries(LoggerLevel);
  const loggerConsole: Partial<LoggerConsole> = {};

  for (const [name, level] of levels) {
    const methodName = lowercaseFirst(name);
    loggerConsole[methodName] = (...messages: unknown[]) => {
      nativeConsole[methodName](logger.leader(level), ...messages);
    };
  }

  return loggerConsole as LoggerConsole;
};

export const createLogger = (
  type: LoggerNamespaceType,
  namespace: string,
  historicNamespaces: Namespaces,
) => {
  const logger = new BaseLogger(type, namespace, historicNamespaces);

  const compositeLogger: Logger = Object.assign(
    logger,
    createLoggerConsole(logger),
    createExtendableLogger(logger),
  );

  return compositeLogger;
};
