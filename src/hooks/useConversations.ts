import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { conversationsService } from "../services/conversations";
import { useAuth } from "../contexts/AuthContext";
import type {
  Conversation,
  CreateConversationRequest,
  UpdateConversationRequest,
  ConversationListOptions,
} from "../types/conversations";

// Query keys
export const conversationKeys = {
  all: ["conversations"] as const,
  lists: () => [...conversationKeys.all, "list"] as const,
  list: (options?: ConversationListOptions) =>
    [...conversationKeys.lists(), options] as const,
  details: () => [...conversationKeys.all, "detail"] as const,
  detail: (id: string) => [...conversationKeys.details(), id] as const,
  search: (query: string) => [...conversationKeys.all, "search", query] as const,
};

/**
 * Hook to list conversations with caching and pagination
 */
export function useConversations(options?: ConversationListOptions) {
  const { user } = useAuth();

  return useQuery({
    queryKey: conversationKeys.list(options),
    queryFn: () => conversationsService.listConversations(options),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get a single conversation with caching
 */
export function useConversation(conversationId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: conversationKeys.detail(conversationId),
    queryFn: () => conversationsService.getConversationWithSummary(conversationId),
    enabled: !!user && !!conversationId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to search conversations
 */
export function useSearchConversations(query: string, enabled: boolean = true) {
  const { user } = useAuth();

  return useQuery({
    queryKey: conversationKeys.search(query),
    queryFn: () => conversationsService.searchConversations(query),
    enabled: !!user && !!query.trim() && enabled,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to create a new conversation
 */
export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateConversationRequest) =>
      conversationsService.createConversation(data),
    onSuccess: (newConversation: Conversation) => {
      // Add to list cache
      queryClient.setQueryData(
        conversationKeys.lists(),
        (old: Conversation[] | undefined) =>
          old ? [newConversation, ...old] : [newConversation],
      );

      // Add to detail cache
      queryClient.setQueryData(
        conversationKeys.detail(newConversation.id),
        newConversation,
      );

      // Invalidate list queries to ensure consistency
      queryClient.invalidateQueries({
        queryKey: conversationKeys.lists(),
      });
    },
  });
}

/**
 * Hook to update a conversation
 */
export function useUpdateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateConversationRequest }) =>
      conversationsService.updateConversation(id, data),
    onSuccess: (updatedConversation: Conversation) => {
      // Update detail cache
      queryClient.setQueryData(
        conversationKeys.detail(updatedConversation.id),
        updatedConversation,
      );

      // Update list cache
      queryClient.setQueryData(
        conversationKeys.lists(),
        (old: Conversation[] | undefined) =>
          old?.map((conv: Conversation) =>
            conv.id === updatedConversation.id ? updatedConversation : conv,
          ),
      );

      // Invalidate list queries to ensure consistency
      queryClient.invalidateQueries({
        queryKey: conversationKeys.lists(),
      });
    },
  });
}

/**
 * Hook to delete a conversation
 */
export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => conversationsService.deleteConversation(id),
    onSuccess: (_: void, deletedId: string) => {
      // Remove from detail cache
      queryClient.removeQueries({
        queryKey: conversationKeys.detail(deletedId),
      });

      // Remove from list cache
      queryClient.setQueryData(
        conversationKeys.lists(),
        (old: Conversation[] | undefined) =>
          old?.filter((conv: Conversation) => conv.id !== deletedId),
      );

      // Invalidate list queries
      queryClient.invalidateQueries({
        queryKey: conversationKeys.lists(),
      });
    },
  });
}

/**
 * Hook to prefetch a conversation for better UX
 */
export function usePrefetchConversation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return (conversationId: string) => {
    if (!user || !conversationId) return;

    queryClient.prefetchQuery({
      queryKey: conversationKeys.detail(conversationId),
      queryFn: () => conversationsService.getConversationWithSummary(conversationId),
      staleTime: 2 * 60 * 1000,
    });
  };
}

/**
 * Hook to invalidate conversation caches (useful after real-time updates)
 */
export function useInvalidateConversations() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.all,
      });
    },
    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.lists(),
      });
    },
    invalidateDetail: (id: string) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.detail(id),
      });
    },
  };
}
