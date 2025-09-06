import { SimpleDropdown } from "./SimpleDropdown";
import ProviderIcon from "../icons/ProviderIcon";
import type { ProviderOut } from "../../types/api";

export function ProviderSelect({
  providers,
  value,
  onChange,
}: {
  providers: ProviderOut[];
  value: string;
  onChange: (next: string | null) => void;
}) {
  const items = [
    {
      id: "all",
      label: "All Providers",
      icon: <span style={{ fontSize: "16px" }}>✴</span>,
    },
    ...providers.map((provider) => ({
      id: provider.id,
      label: provider.label,
      icon: <ProviderIcon id={provider.id} size={16} />,
    })),
  ];

  const currentIcon = value ? (
    <ProviderIcon id={value} size={16} />
  ) : (
    <span style={{ fontSize: "16px" }}>✴</span>
  );

  return (
    <SimpleDropdown
      items={items}
      value={value || "all"}
      onChange={(id) => onChange(id === "all" ? null : id)}
      placeholder="All Providers"
      icon={currentIcon}
    />
  );
}
