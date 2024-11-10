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
  MarkerType,
} from "@xyflow/react";
import { useCallback, useState } from "react";
import colors from "tailwindcss/colors";

type AgentsGraphNode = Node<{
  label: string;
}>;
type AgentsGraphEdge = Edge;

const initialNodes: AgentsGraphNode[] = [
  {
    id: "1",
    type: "input",
    position: { x: 0, y: 0 },
    data: {
      label: "Hello",
    },
  },
  {
    id: "2",
    position: { x: 0, y: 100 },
    data: { label: "World" },
  },
];

const edgeDefaults = {
  color: colors.purple[500],
  size: 24,
};

const initialEdges: AgentsGraphEdge[] = [
  {
    id: "1-2",
    type: "step",
    source: "1",
    target: "2",
    style: {
      stroke: edgeDefaults.color,
    },
    animated: false,
    markerEnd: {
      type: MarkerType.Arrow,
      color: edgeDefaults.color,
      width: edgeDefaults.size,
      height: edgeDefaults.size,
    },
  },
];

export const AgentsGraph = () => {
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

  return (
    <div className="h-full" data-testid="agents-graph">
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
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
