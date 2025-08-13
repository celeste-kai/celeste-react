import type {
  CapabilityOut,
  ProviderOut,
  ModelOut,
  HealthResponse,
  ModelFilters,
} from '../types/api';

// Vite environment variable (required)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not set');
}

export { API_BASE_URL };

// Helper function for handling API errors
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text().catch(() => 'Unknown error');
    throw new Error(error || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

// Health check
export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE_URL}/v1/health`);
  return handleResponse<HealthResponse>(res);
}

// List all capabilities
export async function listCapabilities(): Promise<CapabilityOut[]> {
  const res = await fetch(`${API_BASE_URL}/v1/capabilities`);
  return handleResponse<CapabilityOut[]>(res);
}

// List all providers
export async function listProviders(): Promise<ProviderOut[]> {
  const res = await fetch(`${API_BASE_URL}/v1/providers`);
  return handleResponse<ProviderOut[]>(res);
}

// List models with optional filters
export async function listModels(filters: ModelFilters = {}): Promise<ModelOut[]> {
  const params = new URLSearchParams();
  if (filters.capability) {
    params.set('capability', filters.capability);
  }
  if (filters.provider) {
    params.set('provider', filters.provider);
  }
  const queryString = params.toString();
  const url = queryString
    ? `${API_BASE_URL}/v1/models?${queryString}`
    : `${API_BASE_URL}/v1/models`;

  const res = await fetch(url);
  return handleResponse<ModelOut[]>(res);
}

// Generate text from the backend
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
