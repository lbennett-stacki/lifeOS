import {
  AgentDeclaration,
  ModuleDeclaration,
  ModuleDefinition,
  ProviderDeclaration,
} from '@lifeos/di';

export interface AgentModuleRefectMetadata<A extends AgentDeclaration[]> {
  agents: A;
}

export type AgentModuleDefinition<
  A extends AgentDeclaration[],
  M extends ModuleDeclaration[],
  P extends ProviderDeclaration<A>[],
> = ModuleDefinition<M, P> & AgentModuleRefectMetadata<A>;
