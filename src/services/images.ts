import { API_BASE_URL, handleResponse } from './base';
import type { ImageGenerateResponse } from '../types/api';

export async function generateImages(args: {
  provider: string;
  model?: string;
  prompt: string;
  options?: Record<string, unknown>;
}): Promise<ImageGenerateResponse> {
  const res = await fetch(`${API_BASE_URL}/v1/images/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });
  return handleResponse(res);
}
