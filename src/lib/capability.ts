export const capabilityFilterMap: Record<"text" | "image" | "video" | "audio", string> =
  {
    text: "text_generation",
    image: "image_generation",
    video: "video_generation",
    audio: "text_to_speech",
  };

// Image mode toggle
export type ImageMode = "generate" | "edit";

// Map image modes to backend capabilities
export const imageModeCapabilityMap: Record<ImageMode, string> = {
  generate: "image_generation",
  edit: "image_edit",
};
