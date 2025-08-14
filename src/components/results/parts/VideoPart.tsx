import React from 'react';

export default function VideoPart({ url, path }: { url?: string; path?: string }) {
  const src = url || path;
  return src ? <video src={src} controls style={{ maxWidth: '100%' }} /> : <div>Video</div>;
}
