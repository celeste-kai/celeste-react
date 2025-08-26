import React from 'react';
const LazyMarkdown = React.lazy(() => import('../../common/LazyMarkdown'));

export default function TextPart({ content }: { content: string }) {
  return (
    <React.Suspense fallback={<span /> }>
      <LazyMarkdown>{content}</LazyMarkdown>
    </React.Suspense>
  );
}
