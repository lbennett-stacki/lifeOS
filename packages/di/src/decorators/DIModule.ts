import 'reflect-metadata';

import { AnyConstructor } from '@lifeos/utils';
import { MODULE_REFLECT_METADATA_KEY } from '../keys.js';
import { ProviderDeclaration } from '../provider.js';
import {
  ModuleDeclaration,
  ModuleDefinition,
  ModuleRefectMetadata,
} from '../types.js';

export const DIModule = (data: ModuleDefinition) => {
  return (target: AnyConstructor<any>) => {
    const existing: ModuleRefectMetadata<
      ModuleDeclaration[],
      ProviderDeclaration<any>[]
    > = Reflect.getMetadata(MODULE_REFLECT_METADATA_KEY, target) ?? {
      modules: [],
      providers: [],
    };

    const modules: ModuleDeclaration[] = [
      ...existing.modules,
      ...(data.modules ?? []),
    ];
    const providers: ProviderDeclaration<any>[] = [
      ...existing.providers,
      ...(data.providers ?? []),
    ];

    const nextModuleMetadata = {
      modules,
      providers,
    } satisfies ModuleRefectMetadata<
      ModuleDeclaration[],
      ProviderDeclaration<any>[]
    >;

    Reflect.defineMetadata(
      MODULE_REFLECT_METADATA_KEY,
      nextModuleMetadata,
      target,
    );
  };
};
