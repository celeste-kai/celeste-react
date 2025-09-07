import { Id, type ThreadId } from "../value-objects/Id";
import { Message } from "./Message";
import type { Change, MessageContent, Role, ContentPart } from "../types";
import type { Provider, Capability } from "../../core/enums";

export class Thread {
  private messages: Message[] = [];
  private changes: Change<Message>[] = [];

  constructor(
    private readonly id: ThreadId
  ) {}

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
    role: Role
  ): Message {
    const message = Message.create(provider, capability, model, content, role);
    this.messages.push(message);
    this.changes.push({
      type: "add",
      entity: message,
      id: message.getId()
    });
    return message;
  }

  addExistingMessage(message: Message): void {
    this.messages.push(message);
  }

  updateMessage(messageId: string, parts: ContentPart[]): void {
    const message = this.messages.find(m => m.getId() === messageId);
    if (message) {
      message.updateContent(parts);
      this.changes.push({
        type: "update",
        entity: message,
        id: message.getId()
      });
    }
  }

  appendTextToMessage(messageId: string, text: string): void {
    const message = this.messages.find(m => m.getId() === messageId);
    if (!message) return;

    message.appendText(text);

    if (!this.changes.find(c => c.id === messageId)) {
      this.changes.push({
        type: "update",
        entity: message,
        id: messageId
      });
    }
  }

  getMessages(): Message[] {
    return [...this.messages];
  }

  getLastMessage(): Message | undefined {
    return this.messages[this.messages.length - 1];
  }

  getChanges(): Change<Message>[] {
    return [...this.changes];
  }

  markClean(): void {
    this.changes = [];
  }
}
