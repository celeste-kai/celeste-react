// Use absolute-from-src paths so keys are stable
const iconModules = import.meta.glob("/src/assets/icons/*.{svg,png,jpg,jpeg}", {
  eager: true,
});

// Convert modules to URLs
const icons: Record<string, string> = {};
Object.entries(iconModules).forEach(([path, module]) => {
  icons[path] = (module as any).default;
});

export function ProviderIcon({
  id,
  size = 16,
  alt = "",
}: {
  id: string;
  size?: number;
  alt?: string;
}) {
  // Try different extensions in order of preference
  const extensions = [".svg", ".png", ".jpeg", ".jpg"];
  let src = null;
  for (const ext of extensions) {
    const key = `/src/assets/icons/${id}${ext}`;
    if (icons[key]) {
      src = icons[key];
      break;
    }
  }

  // No fallbacks - let it crash if icon not found
  if (!src) {
    throw new Error(`Icon not found for provider: ${id}`);
  }
  // Check if the image is an SVG
  const isSvg = src && src.includes(".svg");

  // Add white background for xai provider
  const backgroundColor = id === "xai" ? "#FFFFFF" : "transparent";

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt={alt}
      aria-hidden={!alt}
      style={{
        borderRadius: isSvg ? "0" : "50%",
        objectFit: "cover",
        backgroundColor,
      }}
      onError={(_e) => {
        throw new Error(`Failed to load icon: ${src} for provider: ${id}`);
      }}
    />
  );
}

export default ProviderIcon;
