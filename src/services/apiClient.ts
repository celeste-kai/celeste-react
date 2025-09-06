import { API_BASE_URL, handleResponse } from "./base";
import { readNdjson } from "../lib/stream";

type ApiMethod = "GET" | "POST" | "PUT" | "DELETE";

interface ApiConfig {
  endpoint: string;
  method?: ApiMethod;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  streaming?: boolean;
}

interface ApiRequest {
  provider: string;
  model?: string;
  prompt?: string;
  image?: string;
  options?: Record<string, unknown>;
}

export class ApiClient {
  private static defaultHeaders = {
    "Content-Type": "application/json",
  };

  static async request<T>(config: ApiConfig, data?: ApiRequest): Promise<T> {
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...config.headers,
    };

    const body = data ? JSON.stringify(data) : undefined;

    // Debug logging for large requests
    if (body && body.length > 1000) {

      // eslint-disable-next-line no-undef
      console.log(`Large request detected: ${body.length} characters`);

      // eslint-disable-next-line no-undef
      console.log(
        "Headers:",
        Object.keys(headers).map((k) => `${k}: ${headers[k]?.length || "N/A"} chars`),
      );
    }

    const response = await fetch(`${API_BASE_URL}${config.endpoint}`, {
      method: config.method || "POST",
      headers,
      body,
      signal: config.signal,
    });

    if (!response.ok && response.status === 431) {

      // eslint-disable-next-line no-undef
      console.error("431 Request Header Fields Too Large - Headers:", headers);

      // eslint-disable-next-line no-undef
      console.error("Body size:", body?.length || 0);
    }

    return handleResponse<T>(response);
  }

  static async *stream(
    config: ApiConfig,
    data?: ApiRequest,
  ): AsyncGenerator<string, void, unknown> {
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      Accept: "application/x-ndjson",
      ...config.headers,
    };

    const body = data ? JSON.stringify(data) : undefined;

    // Debug logging for large streaming requests
    if (body && body.length > 1000) {

      // eslint-disable-next-line no-undef
      console.log(`Large streaming request detected: ${body.length} characters`);

      // eslint-disable-next-line no-undef
      console.log(
        "Stream Headers:",
        Object.keys(headers).map((k) => `${k}: ${headers[k]?.length || "N/A"} chars`),
      );
    }

    const response = await fetch(`${API_BASE_URL}${config.endpoint}`, {
      method: config.method || "POST",
      headers,
      body,
      signal: config.signal,
    });

    if (!response.ok && response.status === 431) {

      // eslint-disable-next-line no-undef
      console.error(
        "431 Request Header Fields Too Large in stream - Headers:",
        headers,
      );

      // eslint-disable-next-line no-undef
      console.error("Stream Body size:", body?.length || 0);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    for await (const obj of readNdjson(response)) {
      const content = String((obj as any).content);
      if (content) {
        yield content;
      }
    }
  }
}

// Convenience methods for common patterns
export const api = {
  post: <T>(endpoint: string, data: ApiRequest) =>
    ApiClient.request<T>({ endpoint, method: "POST" }, data),

  stream: (endpoint: string, data: ApiRequest, signal?: AbortSignal) =>
    ApiClient.stream({ endpoint, method: "POST", signal }, data),
};
