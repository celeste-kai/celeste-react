// Convert File to base64 string (no data URL prefix)
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const base64Data = base64.split(",")[1]; // Remove data URL prefix
      resolve(base64Data);
    };
    reader.readAsDataURL(file);
  });
}

// Convert File to data URL for preview
export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

// Extract base64 from data URL
export function extractBase64FromDataUrl(dataUrl: string): string {
  return dataUrl.split(",")[1];
}

// Convert base64 to data URL with proper mime type
export function base64ToDataUrl(
  base64: string,
  mimeType: string = "image/png",
): string {
  return `data:${mimeType};base64,${base64}`;
}

// Safely convert API response data to data URL
export function safeApiDataToDataUrl(
  data: unknown,
  mimeType: string = "image/png",
): string | undefined {
  if (!data) {
    return undefined;
  }

  const dataStr = String(data);
  return dataStr.startsWith("data:") ? dataStr : base64ToDataUrl(dataStr, mimeType);
}
