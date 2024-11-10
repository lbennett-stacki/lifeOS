import { LoggerNamespaceType, Namespaces } from './namespaces.js';
import { LoggerLevel } from './level.js';
import { createLogger } from './logger.js';

export class BaseLogger {
  constructor(
    type: LoggerNamespaceType,
    namespace: string,
    private readonly namespaces: Namespaces,
  ) {
    this.namespaces.push({ type, namespace });
  }

  static create(type: LoggerNamespaceType, namespace: string) {
    return createLogger(type, namespace, new Namespaces());
  }

  extend(type: LoggerNamespaceType, namespace: string) {
    return createLogger(type, namespace, this.namespaces.clone());
  }

  leader(level?: LoggerLevel) {
    const namespace = `\n【 ${this.namespaces.toString()} 】\n`;
    return `${namespace}${level ?? ''} \n`;
  }
}
