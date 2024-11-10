import { AnyConstructor } from '@lifeos/utils';
import { AgentModuleDefinition, AgentModuleRefectMetadata } from '../module';
import { AgentDeclaration, DIModule } from '@lifeos/di';
import { AGENT_MODULE_REFLECT_METADATA_KEY } from '../keys';

export const AgentModule = (data: AgentModuleDefinition<any, any, any>) => {
  return (target: AnyConstructor<any>) => {
    DIModule(data)(target);

    const existing: AgentModuleRefectMetadata<any> = Reflect.getMetadata(
      AGENT_MODULE_REFLECT_METADATA_KEY,
      target,
    ) ?? {
      agents: [],
    };

    const agents: AgentDeclaration[] = [...existing.agents, ...data.agents];

    const nextModuleMetadata = {
      agents,
    } satisfies AgentModuleRefectMetadata<any>;

    Reflect.defineMetadata(
      AGENT_MODULE_REFLECT_METADATA_KEY,
      nextModuleMetadata,
      target,
    );
  };
};
