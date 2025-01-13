import { type Node, type Edge } from "@xyflow/react";

type Elements = {
  nodes: Array<Node>;
  edges: Array<Edge>;
};

export const compareElements = (xs: Elements, ys: Elements) => {
  return compareNodes(xs.nodes, ys.nodes) && compareEdges(xs.edges, ys.edges);
};

const compareNodes = (xs: Array<Node>, ys: Array<Node>) => {
  if (xs.length !== ys.length) return false;

  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    const y = ys[i];

    if (!y) {
      return false;
    }

    if (x.resizing || x.dragging) {
      return true;
    }

    if (
      x.measured?.width !== y.measured?.width ||
      x.measured?.height !== y.measured?.height
    ) {
      return false;
    }
  }

  return true;
};

const compareEdges = (xs: Array<Edge>, ys: Array<Edge>) => {
  if (xs.length !== ys.length) {
    return false;
  }

  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    const y = ys[i];

    if (x.source !== y.source || x.target !== y.target) {
      return false;
    }

    if (x?.sourceHandle !== y?.sourceHandle) {
      return false;
    }

    if (x?.targetHandle !== y?.targetHandle) {
      return false;
    }
  }

  return true;
};
