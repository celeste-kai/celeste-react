import { Id, type ConversationId } from "../value-objects/Id";

export class Conversation {
  constructor(
    readonly id: ConversationId,
    private title: string,
    readonly createdAt: Date,
    private updatedAt: Date,
    private metadata: Record<string, unknown> = {}
  ) {}

  static create(title: string): Conversation {
    const now = new Date();
    return new Conversation(
      Id.generate("conversation"),
      title,
      now,
      now
    );
  }

  static fromData(data: {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, unknown>;
  }): Conversation {
    return new Conversation(
      Id.from(data.id, "conversation"),
      data.title,
      data.createdAt,
      data.updatedAt,
      data.metadata || {}
    );
  }

  getId(): string {
    return this.id.toString();
  }

  getTitle(): string {
    return this.title;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getMetadata(): Record<string, unknown> {
    return this.metadata;
  }

  updateTitle(title: string): void {
    this.title = title;
    this.touch();
  }

  updateMetadata(metadata: Record<string, unknown>): void {
    this.metadata = { ...this.metadata, ...metadata };
    this.touch();
  }

  touch(): void {
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.getId(),
      title: this.title,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      metadata: this.metadata
    };
  }
}
