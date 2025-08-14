// Centralized API configuration and helpers

export const API_BASE_URL: string = (() => {
  const url = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (!url) {
    throw new Error('VITE_API_BASE_URL is not set');
  }
  return url;
})();

export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text().catch(() => 'Unknown error');
    throw new Error(error || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}
