export interface ImageArtifact {
  data?: string;
  path?: string;
  metadata: Record<string, unknown>;
}

export interface VideoArtifact {
  url?: string;
  path?: string;
  data?: string;
  metadata: Record<string, unknown>;
}

export interface AudioArtifact {
  url?: string;
  path?: string;
  data?: string;
  format?: string;
  metadata: Record<string, unknown>;
}
