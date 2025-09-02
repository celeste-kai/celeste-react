import { useCallback } from "react";
import { useAsyncOperation } from "./useAsyncOperation";

interface ApiCallOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  transform?: (data: any) => T;
}

/**
 * Hook for making API calls with standardized loading/error states
 * @param apiFunction The async function to execute
 * @param options Configuration options
 */
export function useApiCall<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: ApiCallOptions<T> = {},
) {
  const { onSuccess, onError, transform } = options;

  const { data, isLoading, error, execute, reset, setData, setError, setLoading } =
    useAsyncOperation<T>({
      onSuccess,
      onError,
    });

  const call = useCallback(
    async (...args: any[]): Promise<T | null> => {
      return execute(async () => {
        const result = await apiFunction(...args);
        return transform ? transform(result) : result;
      });
    },
    [execute, apiFunction, transform],
  );

  return {
    data,
    isLoading,
    error,
    call,
    reset,
    setData,
    setError,
    setLoading,
  };
}

/**
 * Hook specifically for CRUD operations
 */
export function useCrudOperations<T>(baseService: {
  create: (data: any) => Promise<T>;
  read: (id: string) => Promise<T>;
  update: (id: string, data: any) => Promise<T>;
  delete: (id: string) => Promise<void>;
}) {
  const createOp = useApiCall(baseService.create);
  const readOp = useApiCall(baseService.read);
  const updateOp = useApiCall(baseService.update);
  const deleteOp = useApiCall(baseService.delete);

  return {
    create: createOp,
    read: readOp,
    update: updateOp,
    delete: deleteOp,

    // Helper to reset all operations
    resetAll: () => {
      createOp.reset();
      readOp.reset();
      updateOp.reset();
      deleteOp.reset();
    },

    // Check if any operation is loading
    isAnyLoading:
      createOp.isLoading ||
      readOp.isLoading ||
      updateOp.isLoading ||
      deleteOp.isLoading,

    // Get any errors
    errors: {
      create: createOp.error,
      read: readOp.error,
      update: updateOp.error,
      delete: deleteOp.error,
    },
  };
}

/**
 * Hook for paginated API calls
 */
export function usePaginatedApiCall<T>(
  apiFunction: (
    page: number,
    limit: number,
    ...args: any[]
  ) => Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
  }>,
  initialPage = 1,
  initialLimit = 10,
) {
  const {
    data: response,
    isLoading,
    error,
    execute,
    reset,
  } = useAsyncOperation<{
    data: T[];
    total: number;
    page: number;
    limit: number;
  }>();

  const loadPage = useCallback(
    (page: number = initialPage, limit: number = initialLimit, ...args: any[]) => {
      return execute(() => apiFunction(page, limit, ...args));
    },
    [execute, apiFunction, initialPage, initialLimit],
  );

  const loadMore = useCallback(
    (...args: any[]) => {
      const currentPage = response?.page || initialPage;
      return loadPage(currentPage + 1, initialLimit, ...args);
    },
    [loadPage, response?.page, initialPage, initialLimit],
  );

  return {
    data: response?.data || [],
    total: response?.total || 0,
    page: response?.page || initialPage,
    limit: response?.limit || initialLimit,
    isLoading,
    error,
    loadPage,
    loadMore,
    reset,
    hasMore: response ? response.page * response.limit < response.total : false,
  };
}
