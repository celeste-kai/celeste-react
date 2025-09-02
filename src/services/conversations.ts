// Legacy service file - now using modular architecture
// This file maintains API compatibility while delegating to new modular services

import { conversationsService as modularConversationsService } from "./conversations/index";

// Re-export the modular service to maintain existing API
export const conversationsService = modularConversationsService;
export { ConversationsService } from "./conversations/index";
