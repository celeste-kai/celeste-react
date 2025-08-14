import { useCallback, useMemo } from 'react';
import { useSelectionsStore } from '../lib/store/selections';
import { useTextController } from './textController';
import { useImageController } from './imageController';
import { useVideoController } from './videoController';

export function useInteraction() {
  const capability = useSelectionsStore((s) => s.capability);

  const text = useTextController();
  const image = useImageController();
  const video = useVideoController();

  const submit = useCallback(
    (prompt: string) => {
      if (capability === 'text') {
        return text.execute(prompt);
      }
      if (capability === 'image') {
        return image.execute(prompt);
      }
      return video.execute(prompt);
    },
    [capability, image, text, video],
  );

  const isGenerating = useMemo(
    () => text.isGenerating || image.isGenerating || video.isGenerating,
    [image.isGenerating, text.isGenerating, video.isGenerating],
  );

  return { submit, isGenerating };
}
