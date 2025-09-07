export class Id<T extends string = string> {
  constructor(private readonly value: string, private readonly _type?: T) {}

  static generate<T extends string>(type?: T): Id<T> {
    return new Id(
      Math.random().toString(36).substring(2) + Date.now().toString(36),
      type
    );
  }

  static from<T extends string>(value: string, type?: T): Id<T> {
    return new Id(value, type);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Id<T>): boolean {
    return this.value === other.value;
  }
}

export type MessageId = Id<"message">;
export type ThreadId = Id<"thread">;
export type ConversationId = Id<"conversation">;
