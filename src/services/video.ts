// TODO: Define the video generation API contract when backend is ready
// Expected endpoint (subject to change): POST /v1/videos/generate

export type VideoGenerateArgs = {
  provider: string;
  model?: string;
  prompt: string;
  options?: Record<string, unknown>;
};

// Placeholder response type until API is defined
export type VideoGenerateResponse = unknown;

export async function generateVideo(args: VideoGenerateArgs): Promise<VideoGenerateResponse> {
  // keep args "used" to satisfy linting until implemented
  void args;
  throw new Error('Video generation API not implemented yet');
}
