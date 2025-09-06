import { useCallback } from "react";
import { useThreadStore } from "../stores/thread/store";
import { useSelectionsStore } from "../stores/selections";
import { streamText } from "../services/text";
import { generateImages } from "../services/images";
import { generateVideo } from "../services/video";
import { generateAudio } from "../services/audio";
import type { ImageMode } from "../lib/capability";
import type { ContentPart } from "../domain/thread";

interface UseSubmissionProps {
  selectedCapability: "text" | "image" | "video" | "audio";
  imageMode?: ImageMode;
  uploadedImage?: string;
  onClearImage?: () => void;
}

const generators = {
  image: async (prompt: string, model: string, provider: string) => {
    const res = await generateImages({ provider, model, prompt });
    return res.images.map((img: any) => ({
      kind: "image" as const,
      dataUrl: img.data,
      path: img.path,
    }));
  },
  video: async (prompt: string, model: string, provider: string, image?: string) => {
    const res = await generateVideo({ provider, model, prompt, image });
    return res.videos.map((v: any) => ({
      kind: "video" as const,
      url: v.url,
      path: v.path,
    }));
  },
  audio: async (prompt: string, model: string, provider: string) => {
    const res = await generateAudio({ provider, model, text: prompt });
    return [{ kind: "audio" as const, data: res.audio.data, format: res.audio.format }];
  },
};

export function useSubmission({
  selectedCapability,
  imageMode: _imageMode,
  uploadedImage,
  onClearImage,
}: UseSubmissionProps) {
  const provider = useSelectionsStore((s) => s.provider) || "";
  const model = useSelectionsStore((s) => s.model) || "";
  const addItem = useThreadStore((s) => s.addItem);
  const addAssistantDraft = useThreadStore((s) => s.addAssistantDraft);
  const appendTextToItem = useThreadStore((s) => s.appendTextToItem);
  const updateItem = useThreadStore((s) => s.updateItem);

  const submit = useCallback(
    async (prompt: string) => {
      // Add user message
      const userParts: ContentPart[] = [{ kind: "text", content: prompt }];
      if (
        uploadedImage &&
        (selectedCapability === "image" || selectedCapability === "video")
      ) {
        userParts.push({ kind: "image", dataUrl: uploadedImage });
      }

      addItem({
        role: "user",
        capability: selectedCapability,
        provider,
        model,
        parts: userParts,
      });

      // Always create a draft for spinning star
      const draftId = addAssistantDraft({
        capability: selectedCapability,
        provider,
        model,
      });

      if (selectedCapability === "text") {
        // Stream text directly into draft
        const stream = await streamText({ provider, model, prompt });
        for await (const chunk of stream) {
          appendTextToItem(draftId, chunk);
        }
      } else {
        // Generate content and update draft
        const generator = generators[selectedCapability as keyof typeof generators];
        if (generator) {
          const parts = await generator(prompt, model, provider, uploadedImage);
          updateItem(draftId, parts);
        }
      }

      onClearImage?.();
    },
    [
      selectedCapability,
      uploadedImage,
      provider,
      model,
      addItem,
      addAssistantDraft,
      appendTextToItem,
      updateItem,
      onClearImage,
    ],
  );

  return { submit };
}
