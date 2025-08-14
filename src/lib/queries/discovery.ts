import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getHealth, listCapabilities, listProviders, listModels } from '../../services/discovery';
import type { ModelFilters } from '../../types/api';

// Query keys factory for better organization
export const discoveryKeys = {
  all: ['discovery'] as const,
  health: () => [...discoveryKeys.all, 'health'] as const,
  capabilities: () => [...discoveryKeys.all, 'capabilities'] as const,
  providers: () => [...discoveryKeys.all, 'providers'] as const,
  models: (filters?: ModelFilters) => [...discoveryKeys.all, 'models', filters] as const,
};

// Health check query
export function useHealth() {
  return useQuery({
    queryKey: discoveryKeys.health(),
    queryFn: getHealth,
    // Health check can be more frequent
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 60 * 1000, // 1 minute
  });
}

// Capabilities query
export function useCapabilities() {
  return useQuery({
    queryKey: discoveryKeys.capabilities(),
    queryFn: listCapabilities,
    // Capabilities rarely change, cache for longer
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

// Providers query
export function useProviders() {
  return useQuery({
    queryKey: discoveryKeys.providers(),
    queryFn: listProviders,
    // Providers rarely change, cache for longer
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

// Models query with optional filters
export function useModels(filters?: ModelFilters) {
  return useQuery({
    queryKey: discoveryKeys.models(filters),
    queryFn: () => listModels(filters),
    // Keep previous data visible while fetching next set to avoid flicker/loading
    placeholderData: keepPreviousData,
    // Models can change more frequently than capabilities/providers
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Combined discovery data hook (fetches all discovery data at once)
export function useDiscoveryData() {
  const healthQuery = useHealth();
  const capabilitiesQuery = useCapabilities();
  const providersQuery = useProviders();
  const modelsQuery = useModels();

  return {
    health: healthQuery,
    capabilities: capabilitiesQuery,
    providers: providersQuery,
    models: modelsQuery,
    isLoading:
      healthQuery.isLoading ||
      capabilitiesQuery.isLoading ||
      providersQuery.isLoading ||
      modelsQuery.isLoading,
    isError:
      healthQuery.isError ||
      capabilitiesQuery.isError ||
      providersQuery.isError ||
      modelsQuery.isError,
  };
}
