import type { ImageArtifact, VideoArtifact, AudioArtifact } from "../core/types";

export type Role = "user" | "assistant" | "system";

export type TextPart = {
  kind: "text";
  content: string;
};

export type ImagePart = {
  kind: "image";
  url?: string;
} & ImageArtifact;

export type VideoPart = {
  kind: "video";
} & VideoArtifact;

export type AudioPart = {
  kind: "audio";
} & AudioArtifact;

export type ContentPart = TextPart | ImagePart | VideoPart | AudioPart;

export interface MessageContent {
  parts: ContentPart[];
}

export interface Change<T = unknown> {
  type: "add" | "update" | "delete";
  entity: T;
  id: string;
}
