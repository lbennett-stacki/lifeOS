import 'reflect-metadata';

import { AnyConstructor } from '@lifeos/utils';
import { MODULE_REFLECT_METADATA_KEY } from '../keys';
import { ProviderDeclaration } from '../provider';
import {
  ModuleDeclaration,
  ModuleDefinition,
  ModuleRefectMetadata,
} from '../types';

export const DIModule = (
  data: ModuleDefinition<ModuleDeclaration[], ProviderDeclaration<any>[]>,
) => {
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
