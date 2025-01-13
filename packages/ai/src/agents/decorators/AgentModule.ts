import { AnyConstructor } from '@lifeos/utils';
import { AgentModuleDefinition, AgentModuleRefectMetadata } from '../module.js';
import { AgentDeclaration, DIModule } from '@lifeos/di';
import { AGENT_MODULE_REFLECT_METADATA_KEY } from '../keys.js';

export const AgentModule = (data: AgentModuleDefinition) => {
  return function (target: AnyConstructor) {
    DIModule(data)(target);

    const existing: AgentModuleRefectMetadata = Reflect.getMetadata(
      AGENT_MODULE_REFLECT_METADATA_KEY,
      target,
    ) ?? {
      agents: [],
    };

    const agents: AgentDeclaration[] = [...existing.agents, ...data.agents];

    const nextModuleMetadata: AgentModuleRefectMetadata = {
      name: data.name,
      agents,
    };

    Reflect.defineMetadata(
      AGENT_MODULE_REFLECT_METADATA_KEY,
      nextModuleMetadata,
      target,
    );
  };
};
