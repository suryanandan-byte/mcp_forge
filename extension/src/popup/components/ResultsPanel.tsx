import { useState } from "react";
import JSZip from "jszip";
import type { ForgeResult, ToolSchema } from "../../types/messages";

interface ResultsPanelProps {
  result: ForgeResult;
  projectName: string;
  onReset: () => void;
}

export default function ResultsPanel({ result, projectName, onReset }: ResultsPanelProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);
  const configJson = JSON.stringify(result.claude_config, null, 2);

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {}
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    zip.file(`${projectName}_mcp.py`, result.server_code);
    zip.file("claude_config.json", configJson);
    zip.file("README.md", result.readme ?? "");
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement("a"), { href: url, download: `${projectName}_mcp.zip` }).click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="panel fade-up">
      {/* ── Top bar ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600, color: "#f0f0f0", marginBottom: 4 }}>
            {projectName}
          </div>
          <div style={{ fontSize: 12, color: "#666" }}>
            {result.tools.length} tool{result.tools.length !== 1 ? "s" : ""} generated
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button onClick={downloadZip} className="btn btn-small">↓ ZIP</button>
          <button onClick={onReset} className="btn btn-ghost">New</button>
        </div>
      </div>

      {/* ── Tools ── */}
      <div>
        <div className="section-head">
          <span className="section-label">Tools</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {result.tools.map((tool, i) => <ToolCard key={i} tool={tool} />)}
        </div>
      </div>

      {/* ── Claude config ── */}
      <div>
        <div className="section-head">
          <span className="section-label">Claude Config</span>
          <button
            className={`inline-btn${copiedKey === "config" ? " success" : ""}`}
            onClick={() => copy(configJson, "config")}
          >
            {copiedKey === "config" ? "✓ copied" : "copy"}
          </button>
        </div>
        <div className="code-block" style={{ maxHeight: 120 }}>
          <pre className="code-text">{configJson}</pre>
        </div>
      </div>

      {/* ── Python source ── */}
      <div>
        <div className="section-head">
          <span className="section-label">Python Source</span>
          <div style={{ display: "flex", gap: 16 }}>
            <button
              className={`inline-btn${copiedKey === "code" ? " success" : ""}`}
              onClick={() => copy(result.server_code, "code")}
            >
              {copiedKey === "code" ? "✓ copied" : "copy"}
            </button>
            <button className="inline-btn" onClick={() => setShowCode(!showCode)}>
              {showCode ? "hide" : "view"}
            </button>
          </div>
        </div>
        {showCode && (
          <div className="code-block fade-up" style={{ maxHeight: 200 }}>
            <pre className="code-text">{result.server_code}</pre>
          </div>
        )}
      </div>

      {/* ── Install command ── */}
      <div style={{ borderTop: "1px solid #1e1e1e", paddingTop: 20 }}>
        <div className="section-label" style={{ marginBottom: 10 }}>Install</div>
        <div className="code-block">
          <code className="code-text">{result.install_command}</code>
        </div>
      </div>
    </div>
  );
}

function ToolCard({ tool }: { tool: ToolSchema }) {
  const params = Object.keys(tool.parameters || {});
  return (
    <div className="tool-card">
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <span className="tool-method">{tool.method}</span>
        <span className="tool-name">{tool.name}</span>
      </div>
      <p className="tool-desc">{tool.description}</p>
      {params.length > 0 && (
        <div className="tool-params">
          {params.map((p) => <span key={p} className="tool-param">{p}</span>)}
        </div>
      )}
    </div>
  );
}
