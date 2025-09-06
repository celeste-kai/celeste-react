import type { CapabilityId } from "../stores/selections";

export type Role = "user" | "assistant" | "system";

export type TextPart = {
  kind: "text";
  content: string;
};

export type ImagePart = {
  kind: "image";
  dataUrl?: string;
  path?: string;
  metadata?: Record<string, unknown>;
  // For image edits - track original image
  originalImage?: {
    dataUrl?: string;
    path?: string;
  };
  editPrompt?: string; // The prompt used for editing
};

export type VideoPart = {
  kind: "video";
  url?: string;
  path?: string;
  metadata?: Record<string, unknown>;
};

export type AudioPart = {
  kind: "audio";
  data?: string; // base64 audio data
  format?: string; // e.g., "wav", "mp3"
  metadata?: Record<string, unknown>;
};

export type ContentPart = TextPart | ImagePart | VideoPart | AudioPart;

export interface ThreadItem {
  id: string;
  role: Role;
  capability: CapabilityId;
  provider: string;
  model: string;
  createdAt: number;
  parts: ContentPart[];
}

export type ThreadItemInput = Omit<ThreadItem, "id" | "createdAt"> & {
  id?: string;
  createdAt?: number;
};
