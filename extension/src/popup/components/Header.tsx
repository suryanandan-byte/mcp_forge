interface HeaderProps {
  backendOnline: boolean | null;
}

export default function Header({ backendOnline }: HeaderProps) {
  const dotColor =
    backendOnline === null ? "#6a5a30" :
    backendOnline ? "#7a9e6a" : "#b05030";

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-logo">
          <div className="header-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="#888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 4v4h10V4" />
              <path d="M5 8h14l1 4H4l1-4z" />
              <path d="M9 12v8M15 12v8M6 20h12" />
            </svg>
          </div>
          <div>
            <div className="header-title">MCP Forge</div>
            <div className="header-sub">Network → MCP Server</div>
          </div>
        </div>

        <div className="status-pill">
          <div
            className={`status-dot${backendOnline === null ? " pulse" : ""}`}
            style={{ background: dotColor }}
          />
          <span className="status-label">
            {backendOnline === null ? "CHECKING" : backendOnline ? "READY" : "OFFLINE"}
          </span>
        </div>
      </div>
    </header>
  );
}
