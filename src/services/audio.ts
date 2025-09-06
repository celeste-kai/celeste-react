import { api } from "./apiClient";

export type AudioGenerateArgs = {
  provider: string;
  model?: string;
  text: string;
  options?: Record<string, unknown>;
};

export type AudioGenerateResponse = {
  audio: {
    data?: string; // base64 audio data
    format?: string;
    sample_rate?: number;
    metadata?: Record<string, unknown>;
  };
};

export async function generateAudio(
  args: AudioGenerateArgs,
): Promise<AudioGenerateResponse> {
  // Validate text size to prevent 431 header errors
  const maxTextLength = 8000; // Reasonable limit for TTS
  if (args.text.length > maxTextLength) {
    throw new Error(
      `Text too long for audio generation. Maximum ${maxTextLength} characters, got ${args.text.length}.`,
    );
  }

  return api.post<AudioGenerateResponse>("/v1/audio/generate", args);
}
