import { AnyConstructor } from '@lifeos/utils';
import { logger } from './logger.js';
import {
  INJECT_REFLECT_METADATA_KEY,
  MODULE_REFLECT_METADATA_KEY,
} from './keys.js';
import { ProviderDeclaration, ProviderKey } from './provider.js';
import {
  InjectReflectMetadata,
  ModuleDeclaration,
  ModuleRefectMetadata,
} from './types.js';

export class Injector<
  M extends ModuleDeclaration[],
  P extends ProviderDeclaration[],
> {
  constructor(private readonly log = logger.service('injector')) {}

  resolve<K extends ProviderKey>(
    target: K,
    providers: P,
  ): K extends AnyConstructor<infer I> ? I : K {
    const metadata: InjectReflectMetadata =
      Reflect.getMetadata(INJECT_REFLECT_METADATA_KEY, target) || [];

    const moduleMetadata: ModuleRefectMetadata<M, P> =
      Reflect.getMetadata(MODULE_REFLECT_METADATA_KEY, target) || {};
    const moduleProviders = moduleMetadata.providers ?? [];

    const providerMap = new Map(
      moduleProviders.map((provider) =>
        'key' in provider
          ? [provider.key, provider.value]
          : [provider, provider],
      ),
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

    const Target =
      typeof target === 'string' || typeof target === 'symbol'
        ? providerMap.get(target).value.constructor
        : target;

    return new Target(...injections);
  }
}
