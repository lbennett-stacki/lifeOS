import { arrayify } from '@lifeos/utils';
import { AGENT_CAPABILITIES_REFLECT_METADATA_KEY } from '../keys.js';

interface AgentCapabilitiesReflectMetadataItem {
  description: string;
  propertyKey: string;
}

export type AgentCapabilitiesReflectMetadata =
  AgentCapabilitiesReflectMetadataItem[];

export const AgentCapability = (capability: string | string[]) => {
  return function (target: any, propertyKey: string) {
    const capabilities = arrayify(capability).map((description) => {
      return {
        description,
        propertyKey,
      };
    });

    const existingCapabilities: AgentCapabilitiesReflectMetadata =
      Reflect.getMetadata(
        AGENT_CAPABILITIES_REFLECT_METADATA_KEY,
        target.constructor,
      ) ?? [];

    const nextCapabilities: AgentCapabilitiesReflectMetadata = [
      ...existingCapabilities,
      ...capabilities,
    ];

    Reflect.defineMetadata(
      AGENT_CAPABILITIES_REFLECT_METADATA_KEY,
      nextCapabilities,
      target.constructor,
    );
  };
};
