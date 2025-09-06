import { api } from "./apiClient";

export type VideoGenerateArgs = {
  provider: string;
  model?: string;
  prompt: string;
  image?: string;
  options?: Record<string, unknown>;
};

export type VideoGenerateResponse = {
  videos: Array<{ url?: string; path?: string; metadata?: Record<string, unknown> }>;
};

export async function generateVideo(
  args: VideoGenerateArgs,
): Promise<VideoGenerateResponse> {
  return api.post<VideoGenerateResponse>("/v1/video/generate", args);
}
