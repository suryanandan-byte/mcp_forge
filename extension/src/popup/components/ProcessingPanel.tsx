import type { ExtensionState } from "../../types/messages";

interface ProcessingPanelProps {
  state: ExtensionState;
}

type Status = "done" | "active" | "pending";

function Step({ label, status }: { label: string; status: Status }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
      <div style={{ width: 18, height: 18, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
        {status === "done" && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7a9e6a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {status === "active" && (
          <div className="spin" style={{
            width: 14, height: 14, borderRadius: "50%",
            border: "2px solid #2a2010", borderTopColor: "#c78f3e",
          }} />
        )}
        {status === "pending" && (
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2a2010" }} />
        )}
      </div>
      <span style={{
        fontSize: 13,
        lineHeight: 1.5,
        color: status === "active" ? "#e8dfc8" : status === "done" ? "#6a5a30" : "#3a3020",
        fontWeight: status === "active" ? 500 : 400,
      }}>
        {label}
      </span>
    </div>
  );
}

export default function ProcessingPanel({ state }: ProcessingPanelProps) {
  return (
    <div className="panel fade-up">
      <div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "#e8dfc8", marginBottom: 6 }}>
          Generating Server
        </h2>
        <p style={{ fontSize: 13, color: "#60584a" }}>
          This usually takes 10–30 seconds.
        </p>
      </div>

      <div className="card" style={{ gap: 18 }}>
        <Step label="Captured network traffic" status="done" />
        <Step label={`Filtered to ${state.filteredCount} relevant endpoint${state.filteredCount === 1 ? "" : "s"}`} status="done" />
        <Step label="AI analyzing API schema & patterns" status="active" />
        <Step label="Generating MCP server tools" status="pending" />
        <Step label="Finalising configuration" status="pending" />
      </div>
    </div>
  );
}
