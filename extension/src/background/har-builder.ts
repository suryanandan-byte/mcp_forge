// ── HAR Builder ──
// Converts raw chrome.debugger network events into HAR 1.2 format

import type { CapturedRequest } from "../types/messages";

// ── Noise filtering (mirrors backend har_service.py) ──

const NOISE_DOMAINS = [
  "google-analytics.com",
  "googletagmanager.com",
  "facebook.com",
  "facebook.net",
  "hotjar.com",
  "mixpanel.com",
  "segment.com",
  "doubleclick.net",
  "sentry.io",
  "cdn.jsdelivr.net",
  "cloudfront.net",
  "akamaihd.net",
  "googlesyndication.com",
  "googleadservices.com",
  "google.com/recaptcha",
  "gstatic.com",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
];

const NOISE_EXTENSIONS = [
  ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico",
  ".woff", ".woff2", ".ttf", ".eot",
  ".css", ".js", ".map",
  ".mp4", ".webm", ".mp3",
];

function isNoise(url: string, mimeType: string): boolean {
  try {
    const parsed = new URL(url);
    const domain = parsed.hostname.toLowerCase();
    const path = parsed.pathname.toLowerCase();

    if (NOISE_DOMAINS.some((noise) => domain.includes(noise))) return true;
    if (NOISE_EXTENSIONS.some((ext) => path.endsWith(ext))) return true;

    const mime = mimeType.toLowerCase();
    if (
      mime.includes("image/") ||
      mime.includes("font/") ||
      mime.includes("text/css") ||
      mime.includes("text/javascript") ||
      mime.includes("application/javascript")
    )
      return true;
  } catch {
    // invalid URL — skip
  }
  return false;
}

function isApiEndpoint(url: string, mimeType: string, resourceType?: string): boolean {
  try {
    const path = new URL(url).pathname.toLowerCase();

    if (mimeType.toLowerCase().includes("application/json")) return true;
    if (path.includes("/api/")) return true;
    if (resourceType && ["xhr", "fetch"].includes(resourceType.toLowerCase()))
      return true;
    // GraphQL endpoints
    if (path.includes("/graphql")) return true;
  } catch {
    // invalid URL
  }
  return false;
}

// ── Filter captured requests ──

export function filterRequests(requests: CapturedRequest[]): CapturedRequest[] {
  return requests.filter((req) => {
    const mime = req.mimeType || "";
    if (isNoise(req.url, mime)) return false;
    if (!isApiEndpoint(req.url, mime, req.resourceType)) return false;
    return true;
  });
}

// ── Build HAR JSON ──

interface HarEntry {
  startedDateTime: string;
  time: number;
  request: {
    method: string;
    url: string;
    httpVersion: string;
    headers: { name: string; value: string }[];
    queryString: { name: string; value: string }[];
    postData?: { mimeType: string; text: string };
    headersSize: number;
    bodySize: number;
  };
  response: {
    status: number;
    statusText: string;
    httpVersion: string;
    headers: { name: string; value: string }[];
    content: {
      size: number;
      mimeType: string;
      text?: string;
    };
    headersSize: number;
    bodySize: number;
  };
  cache: {};
  timings: { send: number; wait: number; receive: number };
  _resourceType?: string;
}

export function buildHar(requests: CapturedRequest[]): string {
  const entries: HarEntry[] = requests.map((req) => {
    const requestHeaders = Object.entries(req.requestHeaders || {}).map(
      ([name, value]) => ({ name, value })
    );

    const responseHeaders = Object.entries(req.responseHeaders || {}).map(
      ([name, value]) => ({ name, value })
    );

    let queryString: { name: string; value: string }[] = [];
    try {
      const url = new URL(req.url);
      queryString = Array.from(url.searchParams.entries()).map(
        ([name, value]) => ({ name, value })
      );
    } catch {
      // skip
    }

    const duration = (req.endTime || req.startTime) - req.startTime;

    const entry: HarEntry = {
      startedDateTime: new Date(req.startTime).toISOString(),
      time: duration,
      request: {
        method: req.method,
        url: req.url,
        httpVersion: "HTTP/1.1",
        headers: requestHeaders,
        queryString,
        headersSize: -1,
        bodySize: req.requestBody ? req.requestBody.length : 0,
      },
      response: {
        status: req.responseStatus || 0,
        statusText: "",
        httpVersion: "HTTP/1.1",
        headers: responseHeaders,
        content: {
          size: req.responseBody ? req.responseBody.length : 0,
          mimeType: req.mimeType || "application/octet-stream",
          text: req.responseBody
            ? req.responseBody.substring(0, 500)
            : undefined,
        },
        headersSize: -1,
        bodySize: req.responseBody ? req.responseBody.length : 0,
      },
      cache: {},
      timings: {
        send: 0,
        wait: duration,
        receive: 0,
      },
      _resourceType: req.resourceType || "xhr",
    };

    if (req.requestBody) {
      entry.request.postData = {
        mimeType: "application/json",
        text: req.requestBody,
      };
    }

    return entry;
  });

  const har = {
    log: {
      version: "1.2",
      creator: {
        name: "MCP Forge Chrome Extension",
        version: "1.0.0",
      },
      entries,
    },
  };

  return JSON.stringify(har);
}
