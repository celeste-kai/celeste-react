export enum Capability {
  NONE = 0,
  TEXT_GENERATION = 1 << 0,
  IMAGE_GENERATION = 1 << 1,
  IMAGE_EDIT = 1 << 2,
  AUDIO_TRANSCRIPTION = 1 << 3,
  AUDIO_GENERATION = 1 << 4,
  EMBEDDINGS = 1 << 5,
  DOCUMENT_INTELLIGENCE = 1 << 6,
  VIDEO_GENERATION = 1 << 7,
  STRUCTURED_OUTPUT = 1 << 8,
  FUNCTION_CALLING = 1 << 9,
  VISION = 1 << 10,
  RERANKING = 1 << 11,
  IMAGE_ENHANCE = 1 << 12,
  TEXT_TO_SPEECH = 1 << 13,
}

const CAPABILITY_MAP = new Map(
  Object.entries(Capability)
    .filter(([_, v]) => typeof v === "number" && v !== 0)
    .map(([k, v]) => [v as number, k])
);

export function getCapabilityNames(capabilities: Capability): string[] {
  return Array.from(CAPABILITY_MAP.entries())
    .filter(([v]) => (capabilities & v) === v)
    .map(([_, k]) => k);
}
