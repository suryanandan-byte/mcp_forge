// ── Message types between popup ↔ service worker ──

export type MessageType =
  | "START_RECORDING"
  | "STOP_RECORDING"
  | "GET_STATUS"
  | "RESET_STATE"
  | "FORGE_COMPLETE"
  | "FORGE_ERROR";

export interface StartRecordingMessage {
  type: "START_RECORDING";
  payload: {
    projectName: string;
    taskDescription: string;
  };
}

export interface StopRecordingMessage {
  type: "STOP_RECORDING";
}

export interface GetStatusMessage {
  type: "GET_STATUS";
}

export interface ResetStateMessage {
  type: "RESET_STATE";
}

export type ExtensionMessage =
  | StartRecordingMessage
  | StopRecordingMessage
  | GetStatusMessage
  | ResetStateMessage;

// ── State shared via chrome.storage.session ──

export type ExtensionPhase = "IDLE" | "RECORDING" | "PROCESSING" | "RESULTS" | "ERROR";

export interface CapturedRequest {
  requestId: string;
  method: string;
  url: string;
  requestHeaders: Record<string, string>;
  requestBody?: string;
  responseStatus?: number;
  responseHeaders?: Record<string, string>;
  responseBody?: string;
  mimeType?: string;
  resourceType?: string;
  startTime: number;
  endTime?: number;
}

export interface ToolSchema {
  name: string;
  description: string;
  parameters: Record<string, any>;
  endpoint: string;
  method: string;
}

export interface ForgeResult {
  server_code: string;
  tools: ToolSchema[];
  install_command: string;
  claude_config: Record<string, any>;
  readme: string;
}

export interface ExtensionState {
  phase: ExtensionPhase;
  projectName: string;
  taskDescription: string;
  capturedCount: number;
  filteredCount: number;
  result: ForgeResult | null;
  error: string | null;
}

export const DEFAULT_STATE: ExtensionState = {
  phase: "IDLE",
  projectName: "",
  taskDescription: "",
  capturedCount: 0,
  filteredCount: 0,
  result: null,
  error: null,
};
