import type { Conversation, ConversationMessage } from "../../types/conversations";
import { conversationsCrudService } from "./conversationsCrud";
import { createConversationSummary } from "../../utils/conversationTransforms";

export class ConversationsUtilsService {
  /**
   * Get conversation with message count and last message time
   */
  async getConversationWithSummary(id: string): Promise<
    | (Conversation & {
        messageCount: number;
        lastMessageAt: Date;
      })
    | null
  > {
    const conversation = await conversationsCrudService.getConversation(id);
    if (!conversation) {
      return null;
    }

    const messages = await conversationsCrudService.getConversationMessages(id);
    const summary = createConversationSummary(messages);

    return {
      ...conversation,
      messageCount: summary.messageCount,
      lastMessageAt: summary.lastMessageAt,
    };
  }

  /**
   * Get conversations with summary data (batch operation)
   */
  async getConversationsWithSummary(conversationIds: string[]): Promise<
    Array<
      Conversation & {
        messageCount: number;
        lastMessageAt: Date;
        capabilities: string[];
        providers: string[];
      }
    >
  > {
    const results = await Promise.allSettled(
      conversationIds.map(async (id) => {
        const conversation = await conversationsCrudService.getConversation(id);
        if (!conversation) return null;

        const messages = await conversationsCrudService.getConversationMessages(id);
        const summary = createConversationSummary(messages);

        return {
          ...conversation,
          messageCount: summary.messageCount,
          lastMessageAt: summary.lastMessageAt,
          capabilities: summary.capabilities,
          providers: summary.providers,
        };
      }),
    );

    return results
      .filter(
        (result): result is PromiseFulfilledResult<any> =>
          result.status === "fulfilled" && result.value !== null,
      )
      .map((result) => result.value);
  }

  /**
   * Calculate conversation statistics
   */
  async getConversationStats(conversationId: string): Promise<{
    messageCount: number;
    userMessageCount: number;
    assistantMessageCount: number;
    capabilities: string[];
    providers: string[];
    firstMessageAt: Date | null;
    lastMessageAt: Date | null;
    averageMessageLength: number;
  }> {
    const messages =
      await conversationsCrudService.getConversationMessages(conversationId);

    if (messages.length === 0) {
      return {
        messageCount: 0,
        userMessageCount: 0,
        assistantMessageCount: 0,
        capabilities: [],
        providers: [],
        firstMessageAt: null,
        lastMessageAt: null,
        averageMessageLength: 0,
      };
    }

    const userMessages = messages.filter((m) => m.role === "user");
    const assistantMessages = messages.filter((m) => m.role === "assistant");
    const capabilities = [...new Set(messages.map((m) => m.capability))];
    const providers = [...new Set(messages.map((m) => m.provider))];

    const sortedMessages = messages.sort(
      (a, b) => a.created_at.getTime() - b.created_at.getTime(),
    );

    const totalContentLength = messages.reduce((total, message) => {
      return (
        total +
        message.content.reduce((msgTotal, part) => {
          if (part.kind === "text" && "content" in part) {
            return msgTotal + part.content.toString().length;
          }
          return msgTotal;
        }, 0)
      );
    }, 0);

    return {
      messageCount: messages.length,
      userMessageCount: userMessages.length,
      assistantMessageCount: assistantMessages.length,
      capabilities,
      providers,
      firstMessageAt: sortedMessages[0]?.created_at || null,
      lastMessageAt: sortedMessages[sortedMessages.length - 1]?.created_at || null,
      averageMessageLength:
        messages.length > 0 ? totalContentLength / messages.length : 0,
    };
  }

  /**
   * Export conversation to various formats
   */
  async exportConversation(
    conversationId: string,
    format: "json" | "markdown" | "text" = "json",
  ): Promise<string> {
    const conversation = await conversationsCrudService.getConversation(conversationId);
    const messages =
      await conversationsCrudService.getConversationMessages(conversationId);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    switch (format) {
      case "json":
        return JSON.stringify(
          {
            conversation,
            messages,
          },
          null,
          2,
        );

      case "markdown":
        return this.formatConversationAsMarkdown(conversation, messages);

      case "text":
        return this.formatConversationAsText(conversation, messages);

      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  private formatConversationAsMarkdown(
    conversation: Conversation,
    messages: ConversationMessage[],
  ): string {
    let markdown = `# ${conversation.title}\n\n`;
    markdown += `**Created:** ${conversation.created_at.toLocaleDateString()}\n`;
    markdown += `**Updated:** ${conversation.updated_at.toLocaleDateString()}\n\n`;
    markdown += `---\n\n`;

    messages.forEach((message, index) => {
      const roleIcon = message.role === "user" ? "👤" : "🤖";
      markdown += `## ${roleIcon} ${message.role.charAt(0).toUpperCase() + message.role.slice(1)}\n\n`;

      message.content.forEach((part) => {
        if (part.kind === "text" && "content" in part) {
          markdown += `${part.content}\n\n`;
        } else if (part.kind === "image") {
          markdown += `![Generated Image](${part.dataUrl || part.path || "image"})\n\n`;
        } else if (part.kind === "video") {
          markdown += `[Video](${part.url || part.path || "video"})\n\n`;
        }
      });

      if (index < messages.length - 1) {
        markdown += `---\n\n`;
      }
    });

    return markdown;
  }

  private formatConversationAsText(
    conversation: Conversation,
    messages: ConversationMessage[],
  ): string {
    let text = `${conversation.title}\n`;
    text += `${"=".repeat(conversation.title.length)}\n\n`;
    text += `Created: ${conversation.created_at.toLocaleDateString()}\n`;
    text += `Updated: ${conversation.updated_at.toLocaleDateString()}\n\n`;

    messages.forEach((message, index) => {
      text += `[${message.role.toUpperCase()}]\n`;

      message.content.forEach((part) => {
        if (part.kind === "text" && "content" in part) {
          text += `${part.content}\n`;
        } else if (part.kind === "image") {
          text += `[IMAGE: ${part.dataUrl || part.path || "image"}]\n`;
        } else if (part.kind === "video") {
          text += `[VIDEO: ${part.url || part.path || "video"}]\n`;
        }
      });

      if (index < messages.length - 1) {
        text += `\n${"─".repeat(50)}\n\n`;
      }
    });

    return text;
  }
}

// Export singleton instance
export const conversationsUtilsService = new ConversationsUtilsService();
