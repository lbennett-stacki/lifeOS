import { logger as coreLogger } from '@lifeos/logger';

export const logger = coreLogger.module('core-ai');

export const LoggerProviderKey = Symbol('Logger');

export const LoggerProvider = { key: LoggerProviderKey, value: logger };
