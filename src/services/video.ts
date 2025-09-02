import { API_BASE_URL, handleResponse } from "./base";

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
  const res = await fetch(`${API_BASE_URL}/v1/video/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  return handleResponse<VideoGenerateResponse>(res);
}
