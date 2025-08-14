import { useCallback, useState } from 'react';
import { useSelectionsStore } from '../lib/store/selections';
import { useThreadStore } from '../stores/thread';
import { useExecStore } from '../stores/exec';
import { generateVideo } from '../services/video';

export function useVideoController() {
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
        capability: 'video',
        provider,
        model,
        parts: [{ kind: 'text', content: trimmed }],
      });

      setIsGenerating(true);
      setGlobalGenerating(true);
      try {
        const res: any = await generateVideo({ provider, model, prompt: trimmed });
        const videos = Array.isArray(res?.videos) ? res.videos : [];
        const parts = videos.map((v: any) => ({
          kind: 'video' as const,
          url: v?.url ?? undefined,
          path: v?.path ?? undefined,
          metadata: v?.metadata ?? {},
        }));

        if (parts.length > 0) {
          addItem({
            role: 'assistant',
            capability: 'video',
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
    [addItem, model, provider],
  );

  return { execute, isGenerating };
}
