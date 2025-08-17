import { useCallback, useRef, useState } from 'react';
import { useSelectionsStore } from '../lib/store/selections';
import { useThreadStore } from '../stores/thread';
import { useExecStore } from '../stores/exec';
import { streamText } from '../services/text';

export function useTextController() {
  const provider = useSelectionsStore((s) => s.provider) || '';
  const model = useSelectionsStore((s) => s.model) || '';
  const addItem = useThreadStore((s) => s.addItem);
  const addAssistantDraft = useThreadStore((s) => s.addAssistantDraft);
  const appendTextToItem = useThreadStore((s) => s.appendTextToItem);
  const [isGenerating, setIsGenerating] = useState(false);
  const setGlobalGenerating = useExecStore((s) => s.setIsGenerating);
  const abortRef = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

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
      const controller = new AbortController();
      abortRef.current = controller;
      const draftId = addAssistantDraft({ capability: 'text', provider, model });
      try {
        let first = true;
        for await (const chunk of streamText(
          { provider, model, prompt: trimmed },
          { signal: controller.signal },
        )) {
          if (first && chunk) {
            setIsGenerating(false);
            setGlobalGenerating(false);
            first = false;
          }
          appendTextToItem(draftId, chunk);
        }
      } finally {
        abortRef.current = null;
        // In case no chunks arrived, ensure flags are unset
        setIsGenerating(false);
        setGlobalGenerating(false);
      }
    },
    [addAssistantDraft, appendTextToItem, addItem, model, provider],
  );

  return { execute, isGenerating, cancel };
}
