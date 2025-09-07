import { Id, type MessageId } from "../value-objects/Id";
import type { Provider, Capability } from "../../core/enums";
import type { Role, MessageContent, ContentPart } from "../types";

export class Message {
  constructor(
    readonly id: MessageId,
    readonly provider: Provider,
    readonly capability: Capability,
    readonly model: string,
    private content: MessageContent,
    readonly role: Role,
    readonly createdAt: number
  ) {}

  static create(
    provider: Provider,
    capability: Capability,
    model: string,
    content: MessageContent,
    role: Role
  ): Message {
    return new Message(
      Id.generate("message"),
      provider,
      capability,
      model,
      content,
      role,
      Date.now()
    );
  }

  static fromData(data: {
    id: string;
    provider: Provider;
    capability: Capability;
    model: string;
    content: MessageContent;
    role: Role;
    createdAt: number;
  }): Message {
    return new Message(
      Id.from(data.id, "message"),
      data.provider,
      data.capability,
      data.model,
      data.content,
      data.role,
      data.createdAt
    );
  }

  getId(): string {
    return this.id.toString();
  }

  getParts(): ContentPart[] {
    return this.content.parts;
  }

  appendText(text: string): void {
    const textPart = this.content.parts.find(p => p.kind === "text");
    if (textPart && textPart.kind === "text") {
      textPart.content += text;
    } else {
      this.content.parts.push({ kind: "text", content: text });
    }
  }

  appendParts(newParts: ContentPart[]): void {
    // Remove empty text placeholder if it exists
    if (this.content.parts.length === 1 &&
        this.content.parts[0].kind === "text" &&
        !this.content.parts[0].content) {
      this.content.parts = newParts;
    } else {
      this.content.parts.push(...newParts);
    }
  }

  updateContent(parts: ContentPart[]): void {
    this.content = { parts };
  }

  toJSON() {
    return {
      id: this.getId(),
      provider: this.provider,
      capability: this.capability,
      model: this.model,
      content: this.content,
      role: this.role,
      createdAt: this.createdAt
    };
  }
}
