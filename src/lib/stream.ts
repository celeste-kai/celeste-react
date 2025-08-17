// Streaming helpers

export async function* readNdjson(
  response: Response,
): AsyncGenerator<Record<string, unknown>, void, unknown> {
  const textStream = response.body!.pipeThrough(new TextDecoderStream());
  const reader = textStream.getReader();

  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    buffer += value;

    let idx: number;
    while ((idx = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 1);
      if (!line) {
        continue;
      }
      yield JSON.parse(line) as Record<string, unknown>;
    }
  }
}
