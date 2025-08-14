import { API_BASE_URL, handleResponse } from './base';

export async function generateText(args: {
  provider: string;
  model: string;
  prompt: string;
}): Promise<{
  content: string;
  provider: string;
  model: string;
  metadata: Record<string, unknown>;
}> {
  const res = await fetch(`${API_BASE_URL}/v1/text/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });
  return handleResponse(res);
}
