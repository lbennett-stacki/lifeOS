import { Node, Edge, MarkerType, ConnectionLineType } from "@xyflow/react";
import colors from "tailwindcss/colors";
import {
  AgentApp,
  AgentGraph,
  AgentsGraphType,
  DIGraphType,
  GraphType,
} from "@lifeos/ai";

type AgentsGraphFlowNode = Node<{
  label: string;
}>;
type AgentsGraphFlowEdge = Edge;

const EDGE_DEFAULTS = {
  color: colors.purple[500],
  size: 24,
};

const buildNode = ({
  id,
  label,
  type,
  style,
}: Pick<AgentsGraphFlowNode, "id" | "type" | "style"> & {
  label: string;
}): AgentsGraphFlowNode => {
  return {
    id,
    type,
    position: { x: 0, y: 0 },
    style,
    data: {
      label,
    },
  };
};

const buildEdge = ({
  source,
  target,
  color,
}: {
  source: string;
  target: string;
  color?: string;
}) => {
  const id = [source, target].join("-");

  return {
    id,
    source,
    target,
    type: ConnectionLineType.Step,
    style: {
      stroke: color ?? EDGE_DEFAULTS.color,
    },
    animated: false,
    markerEnd: {
      type: MarkerType.Arrow,
      color: EDGE_DEFAULTS.color,
      width: EDGE_DEFAULTS.size,
      height: EDGE_DEFAULTS.size,
    },
  };
};

export const buildNodesAndEdgesFromApp = (root: AgentApp["root"]) => {
  return buildFlowNodesAndEdgesFromModule(new AgentGraph(root));
};

const graphTypeToColor = (type: GraphType) => {
  switch (type) {
    case DIGraphType.Module:
      return colors.purple[500];
    case DIGraphType.Provider:
      return colors.blue[500];
    case AgentsGraphType.Agent:
      return colors.orange[500];
    case AgentsGraphType.Capability:
      return colors.purple[500];
    case AgentsGraphType.Param:
      return colors.green[500];
  }
};

const buildFlowNodesAndEdgesFromModule = (
  graph: AgentGraph,
): {
  nodes: AgentsGraphFlowNode[];
  edges: AgentsGraphFlowEdge[];
} => {
  const flowNodes = graph.nodes.map((node) => {
    return buildNode({
      ...node,
      style: { borderColor: graphTypeToColor(node.type) },
    });
  });

  const flowEdges = graph.edges.map((edge) => {
    return buildEdge({
      source: edge.from,
      target: edge.to,
      color: graphTypeToColor(edge.type),
    });
  });

  return {
    nodes: flowNodes,
    edges: flowEdges,
  };
};
