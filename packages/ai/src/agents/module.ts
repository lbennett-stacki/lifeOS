import { AgentDeclaration, ModuleDefinition } from '@lifeos/di';

export interface AgentModuleRefectMetadata<
  A extends AgentDeclaration[] = AgentDeclaration[],
> {
  name: string;
  agents: A;
}

export type AgentModuleDefinition = ModuleDefinition &
  AgentModuleRefectMetadata;
