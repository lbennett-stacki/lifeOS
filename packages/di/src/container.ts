import { Injector } from './injector';
import { logger } from './logger';
import { ProviderDeclaration } from './provider';
import { AnyConstructor } from '@lifeos/utils';

export class Container<P extends ProviderDeclaration<any>[]> {
  constructor(
    private readonly providers: P,
    private readonly log = logger.service('container'),
    private readonly injector = new Injector(),
  ) {}

  resolve<I, C extends AnyConstructor<I>>(target: C) {
    return this.injector.resolve(target, this.providers);
  }
}
