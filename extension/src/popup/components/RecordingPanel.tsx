import { useState } from "react";
import type { ExtensionState } from "../../types/messages";

interface RecordingPanelProps {
  state: ExtensionState;
  backendOnline: boolean | null;
  onStart: (projectName: string, taskDescription: string) => void;
  onStop: () => void;
}

export default function RecordingPanel({ state, backendOnline, onStart, onStop }: RecordingPanelProps) {
  const [projectName, setProjectName] = useState(state.projectName || "");
  const [taskDescription, setTaskDescription] = useState(state.taskDescription || "");

  const isRecording = state.phase === "RECORDING";
  const canStart =
    !isRecording &&
    projectName.trim().length > 0 &&
    taskDescription.trim().length > 0 &&
    !!backendOnline;

  const handleToggle = () => {
    if (isRecording) {
      onStop();
    } else if (canStart) {
      onStart(
        projectName.trim().replace(/\s+/g, "_").toLowerCase(),
        taskDescription.trim()
      );
    }
  };

  return (
    <div className="panel fade-up">
      {/* ── Form (idle only) ── */}
      {!isRecording && (
        <>
          <div className="field">
            <label className="field-label">Project Name</label>
            <input
              type="text"
              className="field-input"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g.  github_search"
            />
          </div>

          <div className="field">
            <label className="field-label">Task Description</label>
            <textarea
              className="field-input"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Briefly describe what actions you'll perform…"
              rows={3}
            />
          </div>
        </>
      )}

      {/* ── Active recording card ── */}
      {isRecording && (
        <div className="card">
          <div className="card-row">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="status-dot pulse" style={{ background: "#c78f3e", width: 8, height: 8 }} />
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14, color: "#e8dfc8" }}>
                Recording
              </span>
            </div>
            <div className="badge">{state.capturedCount} captured</div>
          </div>

          <p style={{ fontSize: 12, color: "#605840", lineHeight: 1.65 }}>
            Intercepting network traffic on the active tab.<br />
            Perform your actions, then stop when done.
          </p>

          <div style={{ borderTop: "1px solid #201a0e", paddingTop: 12 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#4a3e20", letterSpacing: "0.1em" }}>
              PROJECT / {state.projectName?.toUpperCase() || "—"}
            </span>
          </div>
        </div>
      )}

      {/* ── Action button ── */}
      <button
        onClick={handleToggle}
        disabled={!isRecording && !canStart}
        className={isRecording ? "btn btn-danger" : "btn btn-primary"}
      >
        {isRecording ? (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <rect x="5" y="5" width="14" height="14" rx="2" />
            </svg>
            Stop & Generate
          </>
        ) : "Start Recording"}
      </button>

      {/* ── Backend offline ── */}
      {backendOnline === false && !isRecording && (
        <div className="offline-tip">
          <p style={{ fontSize: 12, color: "#706040" }}>Backend is offline. Start it with:</p>
          <code style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "#a08050",
            background: "#120f08",
            border: "1px solid #272010",
            borderRadius: 6,
            padding: "8px 12px",
            display: "block",
          }}>
            uv run uvicorn main:app --reload
          </code>
        </div>
      )}
    </div>
  );
}
