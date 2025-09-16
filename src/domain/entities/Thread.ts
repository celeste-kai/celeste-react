import { Id, type ThreadId } from "../value-objects/Id";
import { Message } from "./Message";
import type { Change, MessageContent, Role, ContentPart } from "../types";
import type { Provider, Capability } from "../../core/enums";

export class Thread {
  private messages: Message[] = [];
  private changes: Change<Message>[] = [];
  private messageIndex = 0;

  constructor(private readonly id: ThreadId) {}

  static create(): Thread {
    return new Thread(Id.generate("thread"));
  }

  static fromId(id: string): Thread {
    return new Thread(Id.from(id, "thread"));
  }

  getId(): string {
    return this.id.toString();
  }

  addMessage(
    provider: Provider,
    capability: Capability,
    model: string,
    content: MessageContent,
    role: Role,
  ): Message {
    const message = Message.create(
      provider,
      capability,
      model,
      content,
      role,
      this.messageIndex++,
    );
    this.messages.push(message);
    this.changes.push({
      type: "add",
      entity: message,
      id: message.getId(),
    });
    return message;
  }

  addExistingMessage(message: Message): void {
    this.messages.push(message);
    // Update messageIndex to continue from the highest existing index
    if (message.orderIndex >= this.messageIndex) {
      this.messageIndex = message.orderIndex + 1;
    }
  }

  updateMessage(messageId: string, parts: ContentPart[]): void {
    const message = this.messages.find((m) => m.getId() === messageId);
    if (message) {
      message.updateContent(parts);
      this.changes.push({
        type: "update",
        entity: message,
        id: message.getId(),
      });
    }
  }

  appendPartsToMessage(messageId: string, parts: ContentPart[]): void {
    const message = this.messages.find((m) => m.getId() === messageId);
    if (!message) return;

    message.appendParts(parts);

    if (!this.changes.find((c) => c.id === messageId)) {
      this.changes.push({
        type: "update",
        entity: message,
        id: messageId,
      });
    }
  }

  appendTextToMessage(messageId: string, text: string): void {
    const message = this.messages.find((m) => m.getId() === messageId);
    if (!message) return;

    message.appendText(text);

    if (!this.changes.find((c) => c.id === messageId)) {
      this.changes.push({
        type: "update",
        entity: message,
        id: messageId,
      });
    }
  }

  clone(): Thread {
    const cloned = new Thread(this.id);
    cloned.messages = [...this.messages];
    cloned.changes = [...this.changes];
    cloned.messageIndex = this.messageIndex;
    return cloned;
  }

  getMessages(): Message[] {
    return [...this.messages];
  }

  getChanges(): Change<Message>[] {
    return [...this.changes];
  }

  markClean(): void {
    this.changes = [];
  }
}
