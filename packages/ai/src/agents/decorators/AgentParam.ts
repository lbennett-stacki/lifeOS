import { ZodSchema } from 'zod';
import { AGENT_PARAM_REFLECT_METADATA_KEY } from '../keys';

export interface AgentParamReflectMetadataItem {
  parameterIndex: number;
  description: string;
  schema?: ZodSchema;
}

export type AgentParamReflectMetadata = AgentParamReflectMetadataItem[];

export const AgentParam = (description: string, schema: ZodSchema) => {
  return function (
    target: any,
    _propertyKey: string | symbol | undefined,
    parameterIndex: number,
  ) {
    const existing: AgentParamReflectMetadata =
      Reflect.getMetadata(AGENT_PARAM_REFLECT_METADATA_KEY, target) ?? [];

    const newItem: AgentParamReflectMetadataItem = {
      parameterIndex,
      description,
      schema,
    };

    Reflect.defineMetadata(
      AGENT_PARAM_REFLECT_METADATA_KEY,
      [...existing, newItem] satisfies AgentParamReflectMetadata,
      target,
    );
  };
};
