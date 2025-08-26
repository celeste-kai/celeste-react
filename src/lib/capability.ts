export const capabilityFilterMap: Record<
  "text" | "image" | "video" | "rerank",
  string
> = {
  text: "text_generation",
  image: "image_generation",
  video: "video_generation",
  rerank: "reranking",
};

// Image mode toggle
export type ImageMode = "generate" | "edit";

// Map image modes to backend capabilities
export const imageModeCapabilityMap: Record<ImageMode, string> = {
  generate: "image_generation",
  edit: "image_edit",
};
