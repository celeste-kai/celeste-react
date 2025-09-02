import { useState, useCallback } from "react";

interface AsyncOperationState<T = any> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface UseAsyncOperationOptions {
  initialData?: any;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useAsyncOperation<T = any>(options: UseAsyncOperationOptions = {}) {
  const { initialData = null, onSuccess, onError } = options;

  const [state, setState] = useState<AsyncOperationState<T>>({
    data: initialData,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (asyncFn: () => Promise<T>): Promise<T | null> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const result = await asyncFn();
        setState({ data: result, isLoading: false, error: null });
        onSuccess?.(result);
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        setState((prev) => ({ ...prev, isLoading: false, error: errorMessage }));
        onError?.(error instanceof Error ? error : new Error(errorMessage));
        return null;
      }
    },
    [onSuccess, onError],
  );

  const reset = useCallback(() => {
    setState({
      data: initialData,
      isLoading: false,
      error: null,
    });
  }, [initialData]);

  const setData = useCallback((data: T) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error, isLoading: false }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
    setError,
    setLoading,
  };
}
