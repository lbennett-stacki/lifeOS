import { type Node, type Edge } from "@xyflow/react";

export enum Direction {
  TopBottom = "TB",
  LeftRight = "LR",
  RightLeft = "RL",
  BottomTop = "BT",
}

export type LayoutAlgorithmOptions = {
  direction: Direction;
  spacing: number[];
};

export type LayoutAlgorithm = (
  nodes: Node[],
  edges: Edge[],
  options: LayoutAlgorithmOptions,
) => Promise<{ nodes: Node[]; edges: Edge[] }>;
