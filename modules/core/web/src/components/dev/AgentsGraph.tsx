"use client";

import {
  ReactFlow,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  NodeChange,
  EdgeChange,
  Edge,
} from "@xyflow/react";
import { useCallback, useState } from "react";
import { useAutoLayout } from "./useAutolayout";
import { Direction } from "./algorithms";

type AgentsGraphNode = Node<{
  label: string;
}>;
type AgentsGraphEdge = Edge;

const LAYOUT_DEFAULTS = {
  direction: Direction.TopBottom,
  spacing: [100, 100],
};

export const AgentsGraph = ({
  initialNodes,
  initialEdges,
}: {
  initialNodes: AgentsGraphNode[];
  initialEdges: AgentsGraphEdge[];
}) => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange<AgentsGraphNode>[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<AgentsGraphEdge>[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  useAutoLayout(LAYOUT_DEFAULTS);

  return (
    <div className="h-full" data-testid="agents-graph">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        colorMode="dark"
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
