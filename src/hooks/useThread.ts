import { useThreadStore } from "../stores/thread.store";
import { useSelectionStore } from "../stores/selection.store";
import { Thread } from "../domain/entities/Thread";
import { repository } from "../infrastructure/repository";
import * as api from "../infrastructure/api";
import { Capability } from "../core/enums";
import type { MessageContent } from "../domain/types";

export function useThread() {
  const { thread, conversationId, setThread, setConversationId } = useThreadStore();
  const { provider, capability, model } = useSelectionStore();

  const initThread = () => {
    if (!thread) {
      setThread(Thread.create());
    }
  };

  const loadThread = async (convId: string) => {
    const loadedThread = await repository.loadThread(convId);
    setThread(loadedThread);
    setConversationId(convId);
  };

  const saveThread = async () => {
    if (!thread || !conversationId) return;
    await repository.saveThread(thread, conversationId);
  };

  const sendMessage = async (prompt: string, image?: string) => {
    if (!thread) {
      const newThread = Thread.create();
      setThread(newThread);
    }

    const currentThread = thread || Thread.create();

    if (!provider || !model) return;

    const userContent: MessageContent = {
      parts: [{ kind: "text", content: prompt }]
    };
    if (image) {
      userContent.parts.push({ kind: "image", data: image, metadata: {} });
    }

    currentThread.addMessage(provider, capability, model, userContent, "user");
    const assistantMessage = currentThread.addMessage(
      provider,
      capability,
      model,
      { parts: [{ kind: "text", content: "" }] },
      "assistant"
    );

    setThread(currentThread);

    if (capability === Capability.TEXT_GENERATION) {
      const stream = api.streamText(provider, model, prompt);
      for await (const chunk of stream) {
        currentThread.appendTextToMessage(assistantMessage.getId(), chunk);
        setThread(Object.assign(Object.create(Object.getPrototypeOf(currentThread)), currentThread));
      }
    } else if (capability === Capability.IMAGE_GENERATION) {
      const images = await api.generateImages(provider, model, prompt);
      currentThread.updateMessage(assistantMessage.getId(),
        images.map(img => ({ kind: "image" as const, ...img }))
      );
      setThread(Object.assign(Object.create(Object.getPrototypeOf(currentThread)), currentThread));
    } else if (capability === Capability.VIDEO_GENERATION) {
      const videos = await api.generateVideo(provider, model, prompt, image);
      currentThread.updateMessage(assistantMessage.getId(),
        videos.map(v => ({ kind: "video" as const, ...v }))
      );
      setThread(Object.assign(Object.create(Object.getPrototypeOf(currentThread)), currentThread));
    } else if (capability === Capability.TEXT_TO_SPEECH) {
      const audio = await api.generateAudio(provider, model, prompt);
      currentThread.updateMessage(assistantMessage.getId(),
        [{ kind: "audio" as const, ...audio }]
      );
      setThread(Object.assign(Object.create(Object.getPrototypeOf(currentThread)), currentThread));
    }

    if (conversationId) {
      await repository.saveThread(currentThread, conversationId);
    }
  };

  return {
    thread,
    conversationId,
    loadThread,
    saveThread,
    sendMessage,
    initThread
  };
}
