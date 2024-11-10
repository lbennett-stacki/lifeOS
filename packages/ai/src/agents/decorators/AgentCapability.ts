import { CAPABILITIES_REFLECT_METADATA_KEY } from '../keys';

export type AgentCapbilitiesReflectMetadata = string[];

export const AgentCapability = (capability: string) => {
  return (target: any, propertyKey: string) => {
    const capabilities: AgentCapbilitiesReflectMetadata =
      Reflect.getMetadata(
        CAPABILITIES_REFLECT_METADATA_KEY,
        target,
        propertyKey,
      ) || [];

    Reflect.defineMetadata(
      CAPABILITIES_REFLECT_METADATA_KEY,
      [...capabilities, capability] satisfies AgentCapbilitiesReflectMetadata,
      target,
      propertyKey,
    );
  };
};
