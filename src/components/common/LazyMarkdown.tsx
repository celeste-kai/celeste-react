import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function LazyMarkdown({ children }: { children: string }) {
	return <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>;
}