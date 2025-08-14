import { useCallback, useState } from 'react';
import { useSelectionsStore } from '../lib/store/selections';
import { useThreadStore } from '../stores/thread';
import { useExecStore } from '../stores/exec';
import { generateText } from '../services/text';

export function useTextController() {
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

      addItem({
        role: 'user',
        capability: 'text',
        provider,
        model,
        parts: [{ kind: 'text', content: trimmed }],
      });

      setIsGenerating(true);
      setGlobalGenerating(true);
      try {
        const res = await generateText({ provider, model, prompt: trimmed });
        addItem({
          role: 'assistant',
          capability: 'text',
          provider,
          model,
          parts: [{ kind: 'text', content: String(res?.content ?? '') }],
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
