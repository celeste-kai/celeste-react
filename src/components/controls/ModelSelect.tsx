import { SimpleDropdown } from "./SimpleDropdown";
import type { ModelOut } from "../../types/api";

export function ModelSelect({
  models,
  value,
  isLoading = false,
  onSelect,
}: {
  models: ModelOut[];
  value: string;
  isLoading?: boolean;
  onSelect: (m: ModelOut) => void;
}) {
  const items = models.map((model) => ({
    id: model.id,
    label: model.display_name || model.id,
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
