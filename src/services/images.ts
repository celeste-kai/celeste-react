import { api } from "./apiClient";
import type { ImageGenerateResponse, ImageEditResponse } from "../types/api";

export async function generateImages(args: {
  provider: string;
  model?: string;
  prompt: string;
  options?: Record<string, unknown>;
}): Promise<ImageGenerateResponse> {
  return api.post<ImageGenerateResponse>("/v1/images/generate", args);
}

export async function editImage(args: {
  provider: string;
  model?: string;
  prompt: string;
  image: string; // base64
  options?: Record<string, unknown>;
}): Promise<ImageEditResponse> {
  return api.post<ImageEditResponse>("/v1/images/edit", args);
}
