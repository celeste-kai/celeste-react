import React from 'react';
import { BeforeAfterSlider } from '../../image/BeforeAfterSlider';
import type { ImagePart as ImagePartType } from '../../../domain/thread';

export default function ImagePart({ dataUrl, path, originalImage }: ImagePartType) {
  // If this is an edited image with original, show before/after slider
  if (dataUrl && originalImage?.dataUrl) {
    return <BeforeAfterSlider beforeImage={originalImage.dataUrl} afterImage={dataUrl} />;
  }

  // Regular image display
  if (dataUrl) {
    return <img src={dataUrl} alt="generated" style={{ maxWidth: '100%' }} />;
  }
  if (path) {
    return (
      <a href={path} target="_blank" rel="noreferrer">
        View image
      </a>
    );
  }
  return <div>Image</div>;
}
