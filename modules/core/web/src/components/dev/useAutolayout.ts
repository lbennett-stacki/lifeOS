import { useEffect } from "react";
import { useReactFlow, useNodesInitialized, useStore } from "@xyflow/react";

import { getSourceHandlePosition, getTargetHandlePosition } from "./handles";
import { dagre, type LayoutAlgorithmOptions } from "./algorithms";
import { compareElements } from "./compare";

export const useAutoLayout = (options: LayoutAlgorithmOptions) => {
  const { setNodes, setEdges } = useReactFlow();
  const nodesInitialized = useNodesInitialized();
  const elements = useStore(
    (state) => ({
      nodes: state.nodes,
      edges: state.edges,
    }),
    compareElements,
  );

  useEffect(() => {
    if (!nodesInitialized || elements.nodes.length === 0) {
      return;
    }

    const runLayout = async () => {
      const layoutAlgorithm = dagre;
      const nodes = elements.nodes.map((node) => ({ ...node }));
      const edges = elements.edges.map((edge) => ({ ...edge }));

      const { nodes: nextNodes, edges: nextEdges } = await layoutAlgorithm(
        nodes,
        edges,
        options,
      );

      for (const node of nextNodes) {
        node.style = { ...node.style, opacity: 1 };
        node.sourcePosition = getSourceHandlePosition(options.direction);
        node.targetPosition = getTargetHandlePosition(options.direction);
      }

      for (const edge of edges) {
        edge.style = { ...edge.style, opacity: 1 };
      }

      setNodes(nextNodes);
      setEdges(nextEdges);
    };

    runLayout();
  }, [nodesInitialized, elements, options, setNodes, setEdges]);
};
