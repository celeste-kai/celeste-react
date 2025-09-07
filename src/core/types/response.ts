import type { Provider } from "../enums/provider";

export interface AIResponse<T> {
  content: T;
  provider?: Provider;
  metadata: Record<string, unknown>;
}
