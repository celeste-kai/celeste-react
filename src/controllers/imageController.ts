import { useCallback, useState } from 'react';
import { useSelectionsStore } from '../lib/store/selections';
import { useThreadStore } from '../stores/thread';
import { useExecStore } from '../stores/exec';
import { generateImages } from '../services/images';

export function useImageController() {
  const provider = useSelectionsStore((s) => s.provider) || '';
  const model = useSelectionsStore((s) => s.model) || '';
  const addItem = useThreadStore((s) => s.addItem);
  const [isGenerating, setIsGenerating] = useState(false);
  const setGlobalGenerating = useExecStore((s) => s.setIsGenerating);

  const execute = useCallback(
    async (prompt: string) => {
      const trimmed = prompt.trim();
      if (!trimmed || !provider || !model) {
        return;
      }

      // Append user prompt as a turn
      addItem({
        role: 'user',
        capability: 'image',
        provider,
        model,
        parts: [{ kind: 'text', content: trimmed }],
      });

      setIsGenerating(true);
      setGlobalGenerating(true);
      try {
        const res = await generateImages({ provider, model, prompt: trimmed });
        const images = (res?.images || []).map((img: any) => {
          let dataUrl: string | undefined;
          if (img?.data) {
            try {
              dataUrl = String(img.data).startsWith('data:')
                ? String(img.data)
                : `data:image/png;base64,${btoa(String(img.data))}`;
            } catch {
              dataUrl = undefined;
            }
          }
          return {
            kind: 'image' as const,
            dataUrl,
            path: img?.path ?? undefined,
            metadata: img?.metadata ?? {},
          };
        });

        // Append assistant images as a turn
        addItem({
          role: 'assistant',
          capability: 'image',
          provider,
          model,
          parts: images,
        });
      } finally {
        setIsGenerating(false);
        setGlobalGenerating(false);
      }
    },
    [addItem, model, provider],
  );

  return { execute, isGenerating };
}
