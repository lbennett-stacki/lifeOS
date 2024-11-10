import { arrayify } from '@lifeos/utils';
import { AGENT_REFLECT_METADATA_KEY } from '../keys.js';

export interface AgentProps {
  name: AgentReflectMetadata['name'];
  description: string | AgentReflectMetadata['description'];
}

export interface AgentReflectMetadata {
  name: string;
  description: string[];
}

export const Agent = ({
  description: descriptionProps,
  ...update
}: AgentProps) => {
  return function (target: any) {
    const existingAgent: AgentProps =
      Reflect.getMetadata(AGENT_REFLECT_METADATA_KEY, target) ?? {};

    const description = arrayify(descriptionProps);

    const nextAgent: AgentProps = { ...existingAgent, ...update, description };

    Reflect.defineMetadata(AGENT_REFLECT_METADATA_KEY, nextAgent, target);
  };
};
