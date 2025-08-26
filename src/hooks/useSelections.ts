import { useSelectionsStore } from "../lib/store/selections";

export function useSelections() {
  const selectedCapability = useSelectionsStore((s) => s.capability);
  const setSelectedCapability = useSelectionsStore((s) => s.setCapability);
  const selectedModelValue = useSelectionsStore((s) => s.model);
  const selectedProvider = useSelectionsStore((s) => s.provider);
  const setSelectedProvider = useSelectionsStore((s) => s.setProvider);
  const providerFilter = useSelectionsStore((s) => s.providerFilter);
  const setProviderFilter = useSelectionsStore((s) => s.setProviderFilter);
  const imageMode = useSelectionsStore((s) => s.imageMode);
  const setImageMode = useSelectionsStore((s) => s.setImageMode);

  return {
    selectedCapability,
    setSelectedCapability,
    selectedModelValue,
    selectedProvider,
    setSelectedProvider,
    providerFilter,
    setProviderFilter,
    imageMode,
    setImageMode,
  };
}
