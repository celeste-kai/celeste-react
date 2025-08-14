import React, { useCallback, useState } from 'react';
import { generateText } from '../services/text';
import { generateImages } from '../services/images';
import { useSelectionsStore } from '../lib/store/selections';
import { useSelectionsStore as useSel } from '../lib/store/selections';

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
  const capability = useSel((s) => s.capability);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSend = useCallback(async () => {
    const prompt = inputValue.trim();
    if (!prompt) {
      return;
    }
    if (capability === 'text') {
      const userMsg: ChatMessage = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        role: 'user',
        content: prompt,
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputValue('');
    }

    const providerId = provider;
    const modelId = modelFromStore;

    if (!providerId || !modelId) {
      const errorMsg: ChatMessage = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        role: 'assistant',
        content:
          capability === 'text'
            ? "Veuillez sélectionner un fournisseur et un modèle texte avant d'envoyer."
            : "Veuillez sélectionner un fournisseur et un modèle avant de générer.",
        createdAt: Date.now(),
      };
      if (capability === 'text') setMessages((prev) => [...prev, errorMsg]);
      return;
    }
    setIsGenerating(true);
    if (capability === 'text') {
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
    } else if (capability === 'image') {
      generateImages({ provider: providerId, model: modelId, prompt })
        .finally(() => setIsGenerating(false));
    } else {
      // video - placeholder
      setIsGenerating(false);
    }
  }, [capability, inputValue, modelFromStore, provider]);

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
