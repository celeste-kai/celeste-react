import { useEffect, useState } from 'react';
import { listModels } from '../services/api';

export type ModelOut = {
  id: string;
  provider: string;
  display_name?: string | null;
  capabilities: string[];
};

export type ModelFilters = {
  capability?: string;
  provider?: string;
};

export function useModels(filters: ModelFilters = {}) {
  const [models, setModels] = useState<ModelOut[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isActive = true;
    async function fetchModels() {
      try {
        setIsLoading(true);
        const data = await listModels(filters);
        if (isActive) {
          setModels(Array.isArray(data) ? (data as ModelOut[]) : []);
        }
      } catch {
        if (isActive) {
          setModels([]);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }
    fetchModels();
    return () => {
      isActive = false;
    };
  }, [filters.capability, filters.provider]);

  return { models, isLoading };
}
