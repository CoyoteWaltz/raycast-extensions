import { ParseResult } from "../types";

export interface TemplateContext {
  url: string;
  protocol: string;
  host: string;
  hostname: string;
  port?: string;
  path: string;
  pathSegments: string[];
  query: string;
  hash: string;
}

export function buildTemplateContext(parsed: ParseResult): TemplateContext {
  const pathSegments = extractPathSegments(parsed.path || "");

  const queryEntries = parsed.query ? Object.entries(parsed.query).filter(([k, v]) => k && v) : [];
  const queryString =
    queryEntries.length > 0
      ? "?" + queryEntries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v || "")}`).join("&")
      : "";

  return {
    url: parsed.href || "",
    protocol: parsed.protocol || "",
    host: parsed.hostname || "",
    hostname: parsed.hostname || "",
    port: parsed.port,
    path: parsed.path || "/",
    pathSegments,
    query: queryString,
    hash: parsed.hash ? `#${parsed.hash}` : "",
  };
}

function extractPathSegments(path: string): string[] {
  return path
    .split("/")
    .filter((segment) => segment.length > 0)
    .map((segment) => decodeURIComponent(segment));
}

export function getPathByLevel(segments: string[], level: number): string {
  if (level === -1) {
    // Return full path
    return "/" + segments.join("/");
  }
  if (level <= 0 || level > segments.length) {
    return "/";
  }
  return "/" + segments.slice(0, level).join("/");
}
