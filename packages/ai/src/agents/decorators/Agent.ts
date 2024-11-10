import { arrayify } from '@lifeos/utils';
import { AGENT_REFLECT_METADATA_KEY } from '../keys';

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
  return (target: any) => {
    const existing: AgentProps =
      Reflect.getMetadata(AGENT_REFLECT_METADATA_KEY, target) ?? {};

    const description = arrayify(descriptionProps);

    Reflect.defineMetadata(
      AGENT_REFLECT_METADATA_KEY,
      { ...existing, ...update, description } satisfies AgentProps,
      target,
    );
  };
};
