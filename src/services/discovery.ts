import { API_BASE_URL, handleResponse } from './base';
import type {
  CapabilityOut,
  ProviderOut,
  ModelOut,
  HealthResponse,
  ModelFilters,
} from '../types/api';

export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE_URL}/v1/health`);
  return handleResponse<HealthResponse>(res);
}

export async function listCapabilities(): Promise<CapabilityOut[]> {
  const res = await fetch(`${API_BASE_URL}/v1/capabilities`);
  return handleResponse<CapabilityOut[]>(res);
}

export async function listProviders(): Promise<ProviderOut[]> {
  const res = await fetch(`${API_BASE_URL}/v1/providers`);
  return handleResponse<ProviderOut[]>(res);
}

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
