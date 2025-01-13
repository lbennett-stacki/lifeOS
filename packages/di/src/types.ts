import { AnyConstructor, Partials } from '@lifeos/utils';
import { ProviderDeclaration, ProviderKey } from './provider.js';

export interface InjectReflectMetadataItem {
  parameterIndex: number;
  providerKey: ProviderKey;
}

export type InjectReflectMetadata = InjectReflectMetadataItem[];

export type AgentDeclaration = AnyConstructor;

export type ModuleDeclaration = AnyConstructor;

export interface ModuleRefectMetadata<
  M extends ModuleDeclaration[] = ModuleDeclaration[],
  P extends ProviderDeclaration[] = ProviderDeclaration[],
> {
  modules: M;
  providers: P;
}

export type PartialModule<T extends Record<string, any>> = Partials<
  T,
  'modules' | 'providers'
>;

export type ModuleDefinition = PartialModule<ModuleRefectMetadata>;

export type { ProviderDeclaration } from './provider.js';
