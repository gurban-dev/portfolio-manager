function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export const API_URL = trimTrailingSlash(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
);

export const WEBSOCKET_URL = trimTrailingSlash(
  process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws/notifications",
);
