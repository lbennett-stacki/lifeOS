import { RootAgentModule } from "@lifeos/core-ai";
import { AgentsGraph } from "@/components/dev/AgentsGraph";
import { buildNodesAndEdgesFromApp } from "./graph";

const { nodes: initialNodes, edges: initialEdges } =
  buildNodesAndEdgesFromApp(RootAgentModule);

export default function ToolboxAgentsGraphPage() {
  return (
    <div className="h-full">
      <h1>graph</h1>

      <AgentsGraph initialNodes={initialNodes} initialEdges={initialEdges} />
    </div>
  );
}
