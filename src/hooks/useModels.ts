import { useEffect, useState } from 'react';
import { listModels } from '../services/discovery';
import type { ModelOut, ModelFilters } from '../types/api';

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
