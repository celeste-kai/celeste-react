// Utility exports for easy importing
export * from "./image";
export * from "./validation";

// ID generation utility
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
