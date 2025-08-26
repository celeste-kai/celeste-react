export type VideoGenerateArgs = {
  provider: string;
  model?: string;
  prompt: string;
  options?: Record<string, unknown>;
};

export type VideoGenerateResponse = {
  videos: Array<{ url?: string; path?: string; metadata?: Record<string, unknown> }>;
};

export async function generateVideo(
  args: VideoGenerateArgs,
): Promise<VideoGenerateResponse> {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/video/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(text || `HTTP ${res.status}: ${res.statusText}`);
  }
  return (await res.json()) as VideoGenerateResponse;
}
