// Discovery API response types
export interface CapabilityOut {
  id: string;
  label: string;
}

export interface ProviderOut {
  id: string;
  label: string;
}

export interface ModelOut {
  id: string;
  provider: string;
  display_name: string | null;
  capabilities: string[];
}

// Health check response
export interface HealthResponse {
  status: string;
  version: string;
}

// Error response
export interface ErrorResponse {
  code?: string;
  message: string;
  details?: unknown;
}

// Model filters for query params
export interface ModelFilters {
  capability?: string;
  provider?: string;
}

// Image generation response
export interface ImageArtifactOut {
  data?: string | null;
  path?: string | null;
  metadata: Record<string, unknown>;
}

export interface ImageGenerateResponse {
  images: ImageArtifactOut[];
}

// Image editing types
export interface ImageEditResponse {
  image: ImageArtifactOut;
}
