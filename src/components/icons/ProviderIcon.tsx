import React from 'react';

// Use absolute-from-src paths so keys are stable
const icons = import.meta.glob('/src/assets/icons/*.{svg,png,jpg,jpeg}', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export function ProviderIcon({
  id,
  size = 16,
  alt = '',
}: {
  id: string;
  size?: number;
  alt?: string;
}) {
  // Try different extensions in order of preference
  const extensions = ['.svg', '.png', '.jpeg', '.jpg'];
  let src = null;
  for (const ext of extensions) {
    const key = `/src/assets/icons/${id}${ext}`;
    if (icons[key]) {
      src = icons[key];
      break;
    }
  }

  // Fallback to default if not found
  if (!src) {
    src = icons['/src/assets/icons/default.svg'];
  }
  // Check if the image is an SVG
  const isSvg = src.includes('.svg');

  // Add white background for xai provider
  const backgroundColor = id === 'xai' ? '#FFFFFF' : 'transparent';

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt={alt}
      aria-hidden={!alt}
      style={{
        borderRadius: isSvg ? '0' : '50%',
        objectFit: 'cover',
        backgroundColor,
      }}
    />
  );
}

export default ProviderIcon;
