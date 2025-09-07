import { SimpleDropdown } from "./SimpleDropdown";
import type { Model } from "../../core/models/model";

export function ModelSelect({
  models,
  value,
  isLoading = false,
  onSelect,
}: {
  models: Model[];
  value: string;
  isLoading?: boolean;
  onSelect: (m: Model) => void;
}) {
  const items = models.map((model) => ({
    id: model.id,
    label: model.displayName || model.id,
  }));

  return (
    <SimpleDropdown
      items={items}
      value={value}
      onChange={(modelId) => {
        const model = models.find((m) => m.id === modelId);
        if (model) onSelect(model);
      }}
      placeholder={isLoading ? "Loading..." : "Select model"}
    />
  );
}
