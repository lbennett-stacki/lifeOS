import { logger } from '../logger.js';
import {
  MODULE_REFLECT_METADATA_KEY,
  ModuleDeclaration,
  ModuleRefectMetadata,
  ProviderDeclaration,
  ProviderKey,
} from '@lifeos/di';
import { AgentApp } from './app.js';
import { toPascalCase, uppercaseFirst } from '@lifeos/utils';
import { AgentModuleRefectMetadata } from './module.js';
import {
  AGENT_CAPABILITIES_REFLECT_METADATA_KEY,
  AGENT_MODULE_REFLECT_METADATA_KEY,
  AGENT_PARAM_REFLECT_METADATA_KEY,
  AGENT_REFLECT_METADATA_KEY,
} from './keys.js';
import {
  AgentCapabilitiesReflectMetadata,
  AgentParamReflectMetadata,
  AgentReflectMetadata,
} from './lib.js';

export enum DIGraphType {
  Module = 'module',
  Provider = 'provider',
}

export enum AgentsGraphType {
  Agent = 'agent',
  Capability = 'capability',
  Param = 'param',
}

export interface AgentsGraphNodeBase {
  id: string;
  label: string;
  type: GraphType;
}

export interface AgentsGraphEdge {
  id: string;
  from: string;
  to: string;
  type: GraphType;
}

export interface CapabilityNode extends AgentsGraphNodeBase {
  type: AgentsGraphType.Capability;
  args: string[];
  propertyKey: string;
  providerKey: ProviderKey;
}

export type AgentsGraphNode = AgentsGraphNodeBase | CapabilityNode;

export type GraphType = DIGraphType | AgentsGraphType;

export class AgentGraph<
  M extends ModuleDeclaration[] = ModuleDeclaration[],
  P extends ProviderDeclaration[] = ProviderDeclaration[],
> {
  public readonly capabilityMap = new Map<
    /* capability id */ string,
    CapabilityNode
  >();

  public readonly nodes: AgentsGraphNode[];
  public readonly edges: AgentsGraphEdge[];

  constructor(
    public readonly root: AgentApp<M, P>['root'],
    private readonly log = logger.service('agent-app'),
  ) {
    const { nodes, edges } = this.buildNodesAndEdges();

    this.nodes = nodes;
    this.edges = edges;
  }

  listArgs(intent: string): string[] {
    const capabilityNode = this.getCapabilityNode(intent);

    return capabilityNode.args;
  }

  getAction(intent: string): { propertyKey: string; providerKey: ProviderKey } {
    const capabilityNode = this.getCapabilityNode(intent);

    return {
      propertyKey: capabilityNode.propertyKey,
      providerKey: capabilityNode.providerKey,
    };
  }

  private getCapabilityNode(intent: string): CapabilityNode {
    // TODO: This is a temporary mapping of capability id's to PoC intent's
    // In the future this will be handled automagic
    let capabilityId = intent;
    if (capabilityId === 'send_email') {
      capabilityId = 'email#sendEmail';
    }

    const capabilityNode = this.capabilityMap.get(capabilityId);

    if (!capabilityNode) {
      throw new Error(`No capability node found with id: ${capabilityId}`);
    }

    return capabilityNode;
  }

  private buildNodesAndEdges(parent: ModuleDeclaration = this.root) {
    const builtNodes: AgentsGraphNode[] = [];
    const builtEdges: AgentsGraphEdge[] = [];

    const parentModule: AgentModuleRefectMetadata = Reflect.getMetadata(
      AGENT_MODULE_REFLECT_METADATA_KEY,
      parent,
    );

    const parentId = parentModule.name;

    builtNodes.push(
      this.buildNode({
        id: parentId,
        label: toPascalCase(parentId),
        type: DIGraphType.Module,
      }),
    );

    for (const agentConstructor of parentModule.agents) {
      const agent: AgentReflectMetadata = Reflect.getMetadata(
        AGENT_REFLECT_METADATA_KEY,
        agentConstructor,
      );

      const agentId = agent.name;
      builtNodes.push(
        this.buildNode({
          id: agentId,
          label: toPascalCase(agentId),
          type: AgentsGraphType.Agent,
        }),
      );
      builtEdges.push(
        this.buildEdge({
          from: parentId,
          to: agentId,
          type: AgentsGraphType.Agent,
        }),
      );

      const capabilities: AgentCapabilitiesReflectMetadata =
        Reflect.getMetadata(
          AGENT_CAPABILITIES_REFLECT_METADATA_KEY,
          agentConstructor,
        );

      for (const capability of capabilities) {
        const capabilityId = [agentId, capability.propertyKey].join('#');

        const params: AgentParamReflectMetadata =
          Reflect.getMetadata(
            AGENT_PARAM_REFLECT_METADATA_KEY,
            agentConstructor,
            capability.propertyKey,
          ) ?? [];

        for (const param of params) {
          const paramId = param.description;

          builtNodes.push(
            this.buildNode({
              id: paramId,
              label: uppercaseFirst(paramId),
              type: AgentsGraphType.Param,
            }),
          );
          builtEdges.push(
            this.buildEdge({
              from: paramId,
              to: capabilityId,
              type: AgentsGraphType.Param,
            }),
          );
        }

        const capabilityNode = this.buildNode<CapabilityNode>({
          id: capabilityId,
          label: capability.propertyKey,
          type: AgentsGraphType.Capability,
          args: params.map((param) => param.description),
          propertyKey: capability.propertyKey,
          providerKey: agentConstructor,
        });
        builtNodes.push(capabilityNode);
        this.capabilityMap.set(capabilityId, capabilityNode);
        builtEdges.push(
          this.buildEdge({
            from: agentId,
            to: capabilityId,
            type: AgentsGraphType.Capability,
          }),
        );
      }
    }

    const diModule: ModuleRefectMetadata = Reflect.getMetadata(
      MODULE_REFLECT_METADATA_KEY,
      parent,
    );

    for (const provider of diModule.providers) {
      const id =
        'key' in provider
          ? provider.key.constructor === Symbol
            ? provider.key.toString().replace(/Symbol\((.*)\)/, '$1')
            : provider.key.toString()
          : provider.constructor.name;

      builtNodes.push(
        this.buildNode({ id, label: id, type: DIGraphType.Provider }),
      );
      builtEdges.push(
        this.buildEdge({
          from: id,
          to: parentId,
          type: DIGraphType.Provider,
        }),
      );
    }

    for (const childDiModule of diModule.modules) {
      const { nodes: childNodes, edges: childEdges } =
        this.buildNodesAndEdges(childDiModule);

      builtNodes.push(...childNodes);
      builtEdges.push(...childEdges);

      if (childNodes.length === 0) {
        continue;
      }

      builtEdges.push(
        this.buildEdge({
          from: parentId,
          to: childNodes[0].id,
          type: DIGraphType.Module,
        }),
      );
    }

    return { nodes: builtNodes, edges: builtEdges };
  }

  private buildNode<N extends AgentsGraphNode>(node: N): N {
    return {
      ...node,
    };
  }

  private buildEdge({ from, to, ...edge }: Omit<AgentsGraphEdge, 'id'>) {
    const id = [from, to].join('-');

    return {
      id,
      from,
      to,
      ...edge,
    };
  }
}
