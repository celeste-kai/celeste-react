import { useCallback, useState } from 'react';
import { useSelectionsStore } from '../lib/store/selections';
import { useThreadStore } from '../stores/thread';
import { useExecStore } from '../stores/exec';
import { editImage } from '../services/images';
import { extractBase64FromDataUrl } from '../utils/image';

export function useImageEditController() {
  const provider = useSelectionsStore((s) => s.provider) || '';
  const model = useSelectionsStore((s) => s.model) || '';
  const addItem = useThreadStore((s) => s.addItem);
  const [isEditing, setIsEditing] = useState(false);
  const setGlobalGenerating = useExecStore((s) => s.setIsGenerating);

  const execute = useCallback(
    async (prompt: string, imageDataUrl: string) => {
      const trimmed = prompt.trim();
      if (!trimmed || !provider || !model || !imageDataUrl) {
        return;
      }

      // Extract base64 from data URL
      const base64 = extractBase64FromDataUrl(imageDataUrl);

      // Add user message with image and prompt
      addItem({
        role: 'user',
        capability: 'image',
        provider,
        model,
        parts: [
          { kind: 'image', dataUrl: imageDataUrl },
          { kind: 'text', content: trimmed },
        ],
      });

      setIsEditing(true);
      setGlobalGenerating(true);

      // No error handling - let it fail
      const res = await editImage({ provider, model, prompt: trimmed, image: base64 });

      const editedDataUrl = res.image.data ? `data:image/png;base64,${res.image.data}` : undefined;

      // Add edited result with original reference
      addItem({
        role: 'assistant',
        capability: 'image',
        provider,
        model,
        parts: [
          {
            kind: 'image',
            dataUrl: editedDataUrl,
            originalImage: { dataUrl: imageDataUrl },
            editPrompt: trimmed,
            metadata: res.image.metadata || {},
          },
        ],
      });

      setIsEditing(false);
      setGlobalGenerating(false);
    },
    [addItem, model, provider],
  );

  return { execute, isEditing };
}
