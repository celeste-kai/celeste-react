import type { Provider } from "../enums/provider";
import type { Capability } from "../enums/capability";

export interface Model {
  id: string;
  provider: Provider;
  capabilities: Capability;
  displayName?: string;
}

export function supports(model: Model, cap: Capability): boolean {
  return Boolean(model.capabilities & cap);
}

export function supportsAll(model: Model, caps: Capability): boolean {
  return (model.capabilities & caps) === caps;
}
