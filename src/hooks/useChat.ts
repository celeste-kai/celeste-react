import React, { useCallback, useState } from 'react';
import { generateText, listModels } from '../services/api';
import { useSelectionsStore } from '../lib/store/selections';

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
}

export function useChat() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const provider = useSelectionsStore((s) => s.provider) || '';
  const modelFromStore = useSelectionsStore((s) => s.model) || '';
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSend = useCallback(async () => {
    const prompt = inputValue.trim();
    if (!prompt) {
      return;
    }
    const userMsg: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      role: 'user',
      content: prompt,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    let providerId = provider;
    const modelId = modelFromStore;

    // If provider is not selected (All providers), infer provider from selected model
    if (!providerId && modelId) {
      try {
        const all = await listModels();
        const match = all.find((m: any) => m.id === modelId);
        if (match) {
          providerId = match.provider;
        }
      } catch {
        // ignore; will fall back to error message below if still missing
      }
    }

    if (!providerId || !modelId) {
      const errorMsg: ChatMessage = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        role: 'assistant',
        content: "Veuillez sélectionner un fournisseur et un modèle texte avant d'envoyer.",
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      return;
    }
    // Fire-and-forget; append assistant reply when resolved
    setIsGenerating(true);
    generateText({ provider: providerId, model: modelId, prompt })
      .then((data) => {
        const assistantMsg: ChatMessage = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          role: 'assistant',
          content: String(data?.content ?? ''),
          createdAt: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      })
      .catch((err) => {
        const errorMsg: ChatMessage = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          role: 'assistant',
          content: `Erreur: ${err?.message || 'generation failed'}`,
          createdAt: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      })
      .finally(() => setIsGenerating(false));
  }, [inputValue, modelFromStore, provider]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleRefresh = useCallback(() => {
    setInputValue('');
  }, []);

  return {
    messages,
    inputValue,
    setInputValue,
    isGenerating,
    handleSend,
    handleKeyPress,
    handleRefresh,
  };
}
