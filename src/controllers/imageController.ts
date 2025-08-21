import { useCallback, useState } from 'react';
import { useSelectionsStore } from '../lib/store/selections';
import { useThreadStore } from '../stores/thread';
import { useExecStore } from '../stores/exec';
import { generateImages } from '../services/images';
import { validateControllerParams } from '../utils/validation';
import { safeApiDataToDataUrl } from '../utils/image';

export function useImageController() {
  const provider = useSelectionsStore((s) => s.provider) || '';
  const model = useSelectionsStore((s) => s.model) || '';
  const addItem = useThreadStore((s) => s.addItem);
  const [isGenerating, setIsGenerating] = useState(false);
  const setGlobalGenerating = useExecStore((s) => s.setIsGenerating);

  const execute = useCallback(
    async (prompt: string) => {
      const { isValid, trimmedPrompt } = validateControllerParams({ prompt, provider, model });
      if (!isValid) {
        return;
      }

      // Append user prompt as a turn
      addItem({
        role: 'user',
        capability: 'image',
        provider,
        model,
        parts: [{ kind: 'text', content: trimmedPrompt }],
      });

      setIsGenerating(true);
      setGlobalGenerating(true);
      try {
        const res = await generateImages({ provider, model, prompt: trimmedPrompt });
        const images = (res?.images || []).map((img: any) => ({
          kind: 'image' as const,
          dataUrl: safeApiDataToDataUrl(img?.data),
          path: img?.path ?? undefined,
          metadata: img?.metadata ?? {},
        }));

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
