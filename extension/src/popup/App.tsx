import { useState, useEffect, useCallback } from "react";
import type { ExtensionState } from "../types/messages";
import { DEFAULT_STATE } from "../types/messages";
import Header from "./components/Header";
import RecordingPanel from "./components/RecordingPanel";
import ProcessingPanel from "./components/ProcessingPanel";
import ResultsPanel from "./components/ResultsPanel";

export default function App() {
  const [state, setState] = useState<ExtensionState>(DEFAULT_STATE);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  const fetchStatus = useCallback(() => {
    chrome.runtime.sendMessage({ type: "GET_STATUS" }, (response) => {
      if (response?.success && response.state) setState(response.state);
    });
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 800);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("http://localhost:8000/", { signal: AbortSignal.timeout(3000) });
        setBackendOnline(res.ok);
      } catch {
        setBackendOnline(false);
      }
    };
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  const startRecording = (projectName: string, taskDescription: string) => {
    chrome.runtime.sendMessage(
      { type: "START_RECORDING", payload: { projectName, taskDescription } },
      (response) => {
        if (!response?.success) setState((s) => ({ ...s, phase: "ERROR", error: response?.error || "Failed to start" }));
        fetchStatus();
      }
    );
  };

  const stopRecording = () => {
    chrome.runtime.sendMessage({ type: "STOP_RECORDING" }, () => fetchStatus());
  };

  const resetState = () => {
    chrome.runtime.sendMessage({ type: "RESET_STATE" }, () => {
      setState(DEFAULT_STATE);
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: 540 }}>
      <Header backendOnline={backendOnline} />

      {(state.phase === "IDLE" || state.phase === "RECORDING") && (
        <RecordingPanel
          key={state.phase === "IDLE" ? "idle" : "rec"}
          state={state}
          backendOnline={backendOnline}
          onStart={startRecording}
          onStop={stopRecording}
        />
      )}

      {state.phase === "PROCESSING" && <ProcessingPanel state={state} />}

      {state.phase === "RESULTS" && state.result && (
        <ResultsPanel result={state.result} projectName={state.projectName} onReset={resetState} />
      )}

      {state.phase === "ERROR" && (
        <div className="panel fade-up">
          <div className="error-card">
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: "#f87171" }}>
              Error
            </div>
            <p style={{ fontSize: 12, color: "#888", lineHeight: 1.65 }}>{state.error}</p>
            <button onClick={resetState} className="btn btn-ghost" style={{ width: "100%", marginTop: 4 }}>
              Reset & Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
