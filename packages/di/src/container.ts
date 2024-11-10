import { Injector } from './injector.js';
import { logger } from './logger.js';
import { ProviderDeclaration, ProviderKey } from './provider.js';

export class Container<P extends ProviderDeclaration[]> {
  constructor(
    private readonly providers: P,
    private readonly log = logger.service('container'),
    private readonly injector = new Injector(),
  ) {}

  resolve<K extends ProviderKey>(target: K) {
    return this.injector.resolve(target, this.providers);
  }
}
