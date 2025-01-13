import Link from "next/link";

export const TopBar = () => {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Link href="/">Home</Link>
      <Link href="/toolbox/agents/graph">Toolbox &gt; Agents &gt; Graph</Link>
    </div>
  );
};
