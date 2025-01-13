import { ReactFlowProvider } from "@xyflow/react";

export default function ToolboxAgentsGraphLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ReactFlowProvider>{children}</ReactFlowProvider>;
}
