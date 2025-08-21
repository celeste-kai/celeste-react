import { useCallback, useState } from 'react';
import { useSelectionsStore } from '../lib/store/selections';
import { useThreadStore } from '../stores/thread';
import { useExecStore } from '../stores/exec';
import { editImage } from '../services/images';
import { extractBase64FromDataUrl, base64ToDataUrl } from '../utils/image';
import { validateImageEditParams } from '../utils/validation';

export function useImageEditController() {
  const provider = useSelectionsStore((s) => s.provider) || '';
  const model = useSelectionsStore((s) => s.model) || '';
  const addItem = useThreadStore((s) => s.addItem);
  const [isEditing, setIsEditing] = useState(false);
  const setGlobalGenerating = useExecStore((s) => s.setIsGenerating);

  const execute = useCallback(
    async (prompt: string, imageDataUrl: string) => {
      const { isValid, trimmedPrompt } = validateImageEditParams({
        prompt,
        provider,
        model,
        imageDataUrl,
      });
      if (!isValid) {
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
          { kind: 'text', content: trimmedPrompt },
        ],
      });

      setIsEditing(true);
      setGlobalGenerating(true);

      // No error handling - let it fail
      const res = await editImage({ provider, model, prompt: trimmedPrompt, image: base64 });

      const editedDataUrl = res.image.data ? base64ToDataUrl(res.image.data) : undefined;

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
            editPrompt: trimmedPrompt,
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
