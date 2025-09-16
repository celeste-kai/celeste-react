import type { Provider } from "../core/enums";
import type { ImageArtifact, VideoArtifact, AudioArtifact } from "../core/types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export async function* streamText(
  provider: Provider,
  model: string,
  prompt: string,
  signal?: AbortSignal,
): AsyncGenerator<string> {
  const res = await fetch(`${BASE_URL}/v1/text/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/x-ndjson",
    },
    body: JSON.stringify({ provider, model, prompt }),
    signal,
  });

  const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += value;
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.trim()) {
        const data = JSON.parse(line);
        if (data.content) yield data.content;
      }
    }
  }
}

export async function generateImages(
  provider: Provider,
  model: string,
  prompt: string,
): Promise<ImageArtifact[]> {
  const res = await fetch(`${BASE_URL}/v1/images/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider, model, prompt }),
  });
  const data = await res.json();
  return data.images;
}

export async function editImage(
  provider: Provider,
  model: string,
  prompt: string,
  image: string,
): Promise<ImageArtifact> {
  const res = await fetch(`${BASE_URL}/v1/images/edit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider, model, prompt, image }),
  });
  const data = await res.json();
  return data.image;
}

export async function generateVideo(
  provider: Provider,
  model: string,
  prompt: string,
  image?: string,
): Promise<VideoArtifact[]> {
  const res = await fetch(`${BASE_URL}/v1/video/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider, model, prompt, image }),
  });
  const data = await res.json();
  return data.videos.map((v: any) => ({
    ...v,
    path: v.url?.startsWith("/v1/") ? `${BASE_URL}${v.url}` : v.url || v.path,
    url: undefined,
  }));
}

export async function generateAudio(
  provider: Provider,
  model: string,
  text: string,
): Promise<AudioArtifact> {
  const res = await fetch(`${BASE_URL}/v1/audio/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider, model, text }),
  });
  const data = await res.json();
  return {
    ...data.audio,
    path: data.audio.url?.startsWith("/v1/")
      ? `${BASE_URL}${data.audio.url}`
      : data.audio.url || data.audio.path,
    url: undefined,
  };
}

export async function getHealth() {
  const res = await fetch(`${BASE_URL}/v1/health`);
  return res.json();
}

export async function listCapabilities() {
  const res = await fetch(`${BASE_URL}/v1/capabilities`);
  return res.json();
}

export async function listProviders() {
  const res = await fetch(`${BASE_URL}/v1/providers`);
  return res.json();
}

export async function listModels(capability?: string, provider?: string) {
  const params = new URLSearchParams();
  if (capability) params.append("capability", capability);
  if (provider) params.append("provider", provider);

  const url = `${BASE_URL}/v1/models${params.toString() ? `?${params}` : ""}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.map((m: any) => ({ ...m, displayName: m.display_name }));
}
