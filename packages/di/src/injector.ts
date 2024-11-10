import { AnyConstructor } from '@lifeos/utils';
import { logger } from './logger';
import {
  INJECT_REFLECT_METADATA_KEY,
  MODULE_REFLECT_METADATA_KEY,
} from './keys';
import { ProviderDeclaration } from './provider';
import {
  InjectReflectMetadata,
  ModuleDeclaration,
  ModuleRefectMetadata,
} from './types';

export class Injector<
  M extends ModuleDeclaration[],
  P extends ProviderDeclaration<any>[],
> {
  constructor(private readonly log = logger.service('injector')) {}

  resolve<C extends AnyConstructor<any>>(
    target: C,
    providers: P,
  ): C extends AnyConstructor<infer I> ? I : never {
    const metadata: InjectReflectMetadata =
      Reflect.getMetadata(INJECT_REFLECT_METADATA_KEY, target) || [];

    const moduleMetadata: ModuleRefectMetadata<M, P> =
      Reflect.getMetadata(MODULE_REFLECT_METADATA_KEY, target) || {};
    const moduleProviders = moduleMetadata.providers ?? [];

    const providerMap = new Map(
      moduleProviders.map((provider: any) => [provider.key, provider.value]),
    );

    for (const provider of providers) {
      if (provider instanceof Function) {
        providerMap.set(provider, this.resolve(provider, providers));
      } else {
        providerMap.set(provider.key, provider.value);
      }
    }

    const injections: any[] = [];

    for (const { parameterIndex, providerKey } of metadata) {
      if (!providerMap.has(providerKey)) {
        throw new Error(`No provider found for key: ${providerKey.toString()}`);
      }

      injections[parameterIndex] = providerMap.get(providerKey);
    }

    return new target(...injections);
  }
}
