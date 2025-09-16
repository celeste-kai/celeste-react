export class Id<T extends string = string> {
  constructor(private readonly value: string, private readonly _type?: T) {}

  static generate<T extends string>(type?: T): Id<T> {
    // Generate a UUID v4 format
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    return new Id(uuid, type);
  }

  static from<T extends string>(value: string, type?: T): Id<T> {
    return new Id(value, type);
  }

  toString(): string {
    return this.value;
  }
}

export type MessageId = Id<"message">;
export type ThreadId = Id<"thread">;
export type ConversationId = Id<"conversation">;
