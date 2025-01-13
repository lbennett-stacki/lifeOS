import { ZodSchema } from 'zod';
import { AGENT_PARAM_REFLECT_METADATA_KEY } from '../keys.js';

export interface AgentParamReflectMetadataItem {
  parameterIndex: number;
  description: string;
  schema?: ZodSchema;
}

export type AgentParamReflectMetadata = AgentParamReflectMetadataItem[];

export const AgentParam = (description: string, schema: ZodSchema) => {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const existingParams: AgentParamReflectMetadata =
      Reflect.getMetadata(
        AGENT_PARAM_REFLECT_METADATA_KEY,
        target.constructor,
        propertyKey,
      ) ?? [];

    const newParam: AgentParamReflectMetadataItem = {
      parameterIndex,
      description,
      schema,
    };

    const newParams: AgentParamReflectMetadata = [...existingParams];
    newParams[parameterIndex] = newParam;

    Reflect.defineMetadata(
      AGENT_PARAM_REFLECT_METADATA_KEY,
      newParams,
      target.constructor,
      propertyKey,
    );
  };
};
