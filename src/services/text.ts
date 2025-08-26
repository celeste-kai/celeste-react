import { readNdjson } from "../lib/stream";
import { API_BASE_URL } from "./base";

export async function* streamText(
  args: { provider: string; model: string; prompt: string },
  options: { signal?: AbortSignal } = {},
): AsyncGenerator<string, void, unknown> {
  const res = await fetch(`${API_BASE_URL}/v1/text/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/x-ndjson",
    },
    body: JSON.stringify(args),
    signal: options.signal,
  });

  for await (const obj of readNdjson(res)) {
    const content = String((obj as any)?.content ?? "");
    if (content) {
      yield content;
    }
  }
}
