import { AnyConstructor, Partials } from '@lifeos/utils';
import { ProviderDeclaration, ProviderKey } from './provider';

export interface InjectReflectMetadataItem {
  parameterIndex: number;
  providerKey: ProviderKey;
}

export type InjectReflectMetadata = InjectReflectMetadataItem[];

export type AgentDeclaration = AnyConstructor<any>;

export type ModuleDeclaration = AnyConstructor<any>;

export interface ModuleRefectMetadata<
  M extends ModuleDeclaration[],
  P extends ProviderDeclaration<any>[],
> {
  modules: M;
  providers: P;
}

export type PartialModule<T extends Record<string, any>> = Partials<
  T,
  'modules' | 'providers'
>;

export type ModuleDefinition<
  M extends ModuleDeclaration[],
  P extends ProviderDeclaration<any>[],
> = PartialModule<ModuleRefectMetadata<M, P>>;

export type { ProviderDeclaration } from './provider';
