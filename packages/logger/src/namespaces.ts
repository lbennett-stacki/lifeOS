export enum LoggerNamespaceType {
  Module = '🧱',
  Package = '📦',
  Function = '🧮',
  Service = '🔧',
  Agent = '🤖',
  AgentFunction = '🤖🧮',
}

export interface LoggerNamespace {
  type: LoggerNamespaceType;
  namespace: string;
}

export class Namespaces extends Array {
  constructor(...namespaces: LoggerNamespace[]) {
    super();
    this.push(...namespaces);
  }

  toString() {
    return this.map(
      ({ type, namespace }) => [type, namespace].join(' '),
      '',
    ).join(' > ');
  }

  clone() {
    return new Namespaces(...this);
  }
}
