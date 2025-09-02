import { useCallback, useState } from "react";
import { useSelectionsStore } from "../lib/store/selections";
import { useThreadStore } from "../stores/thread";
import { useExecStore } from "../stores/exec";
import { generateVideo } from "../services/video";
import { validateControllerParams } from "../utils/validation";

export function useVideoController() {
  const provider = useSelectionsStore((s) => s.provider) || "";
  const model = useSelectionsStore((s) => s.model) || "";
  const addItem = useThreadStore((s) => s.addItem);
  const [isGenerating, setIsGenerating] = useState(false);
  const setGlobalGenerating = useExecStore((s) => s.setIsGenerating);

  const execute = useCallback(
    async (prompt: string) => {
      const { isValid, trimmedPrompt } = validateControllerParams({
        prompt,
        provider,
        model,
      });
      if (!isValid) {
        return;
      }

      // Append user prompt as a turn
      addItem({
        role: "user",
        capability: "video",
        provider,
        model,
        parts: [{ kind: "text", content: trimmedPrompt }],
      });

      setIsGenerating(true);
      setGlobalGenerating(true);
      try {
        const res = await generateVideo({
          provider,
          model,
          prompt: trimmedPrompt,
        });

        const videos = Array.isArray(res?.videos) ? res.videos : [];

        const parts = videos.map((v) => {
          const processedUrl = v?.url?.startsWith("/")
            ? `${import.meta.env.VITE_API_BASE_URL}${v.url}`
            : v?.url;

          return {
            kind: "video" as const,
            url: processedUrl,
            path: v?.path ?? undefined,
            metadata: v?.metadata ?? {},
          };
        });

        if (parts.length > 0) {
          addItem({
            role: "assistant",
            capability: "video",
            provider,
            model,
            parts,
          });
        }
      } finally {
        setIsGenerating(false);
        setGlobalGenerating(false);
      }
    },
    [addItem, model, provider, setGlobalGenerating],
  );

  return { execute, isGenerating };
}
