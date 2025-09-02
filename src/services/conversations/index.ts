// Re-export all conversation services
export * from "./conversationsCrud";
export * from "./conversationsSearch";
export * from "./conversationsUtils";

// Unified service that combines all conversation services
import { conversationsCrudService } from "./conversationsCrud";
import { conversationsSearchService } from "./conversationsSearch";
import { conversationsUtilsService } from "./conversationsUtils";

// Create a unified service that maintains the existing API
export class ConversationsService {
  // CRUD operations
  createConversation = conversationsCrudService.createConversation.bind(
    conversationsCrudService,
  );
  getConversation = conversationsCrudService.getConversation.bind(
    conversationsCrudService,
  );
  listConversations = conversationsCrudService.listConversations.bind(
    conversationsCrudService,
  );
  updateConversation = conversationsCrudService.updateConversation.bind(
    conversationsCrudService,
  );
  deleteConversation = conversationsCrudService.deleteConversation.bind(
    conversationsCrudService,
  );

  // Message operations
  createMessage = conversationsCrudService.createMessage.bind(conversationsCrudService);
  getConversationMessages = conversationsCrudService.getConversationMessages.bind(
    conversationsCrudService,
  );
  updateMessage = conversationsCrudService.updateMessage.bind(conversationsCrudService);
  deleteMessage = conversationsCrudService.deleteMessage.bind(conversationsCrudService);

  // Search operations
  searchConversations = conversationsSearchService.searchConversations.bind(
    conversationsSearchService,
  );
  searchByCapability = conversationsSearchService.searchByCapability.bind(
    conversationsSearchService,
  );
  searchByProvider = conversationsSearchService.searchByProvider.bind(
    conversationsSearchService,
  );
  advancedSearch = conversationsSearchService.advancedSearch.bind(
    conversationsSearchService,
  );

  // Utility operations
  getConversationWithSummary =
    conversationsUtilsService.getConversationWithSummary.bind(
      conversationsUtilsService,
    );
  getConversationsWithSummary =
    conversationsUtilsService.getConversationsWithSummary.bind(
      conversationsUtilsService,
    );
  getConversationStats = conversationsUtilsService.getConversationStats.bind(
    conversationsUtilsService,
  );
  exportConversation = conversationsUtilsService.exportConversation.bind(
    conversationsUtilsService,
  );
}

// Export singleton instance to maintain compatibility
export const conversationsService = new ConversationsService();
