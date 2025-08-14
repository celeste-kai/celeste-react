import React from 'react';

export default function ImagePart({ dataUrl, path }: { dataUrl?: string; path?: string }) {
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
