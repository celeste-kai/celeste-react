import { api } from "./apiClient";

export async function* streamText(
  args: { provider: string; model: string; prompt: string },
  options: { signal?: AbortSignal } = {},
): AsyncGenerator<string, void, unknown> {
  yield* api.stream("/v1/text/stream", args, options.signal);
}
