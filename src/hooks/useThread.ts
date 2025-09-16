import { useThreadStore } from "../stores/thread.store";
import { useSelectionStore } from "../stores/selection.store";
import { Thread } from "../domain/entities/Thread";
import { repository } from "../infrastructure/repository";
import * as api from "../infrastructure/api";
import { Capability } from "../core/enums";
import type { MessageContent } from "../domain/types";
import type { ImageArtifact } from "../core/types";
import { Conversation } from "../domain/entities/Conversation";
import { useConversationStore } from "../stores/conversation.store";

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

  const generateConversationTitle = (prompt: string): string => {
    const trimmed = prompt.trim();
    if (!trimmed) return "New Conversation";

    const normalized = trimmed.replace(/\s+/g, " ");
    const maxLength = 60;
    return normalized.length > maxLength
      ? `${normalized.slice(0, maxLength).trimEnd()}…`
      : normalized;
  };

  const sendMessage = async (prompt: string, image?: ImageArtifact | null) => {
    if (!thread) {
      const newThread = Thread.create();
      setThread(newThread);
    }

    const currentThread = thread || Thread.create();

    if (!provider || !model) return;

    let activeConversationId = conversationId;
    if (!activeConversationId) {
      const conversation = Conversation.create(generateConversationTitle(prompt));
      await repository.saveConversation(conversation);
      activeConversationId = conversation.getId();
      setConversationId(activeConversationId);
      await useConversationStore.getState().refresh();
    }

    const userContent: MessageContent = {
      parts: [{ kind: "text", content: prompt }],
    };
    if (image) {
      userContent.parts.push({ kind: "image", ...image });
    }

    currentThread.addMessage(provider, capability, model, userContent, "user");
    const assistantMessage = currentThread.addMessage(
      provider,
      capability,
      model,
      { parts: [{ kind: "text", content: "" }] },
      "assistant",
    );

    setThread(currentThread.clone());

    if (capability === Capability.TEXT_GENERATION) {
      const stream = api.streamText(provider, model, prompt);
      for await (const chunk of stream) {
        currentThread.appendTextToMessage(assistantMessage.getId(), chunk);
        setThread(currentThread.clone());
      }
    } else if (capability === Capability.IMAGE_GENERATION) {
      const images = await api.generateImages(provider, model, prompt);
      currentThread.appendPartsToMessage(
        assistantMessage.getId(),
        images.map((img) => ({ kind: "image" as const, ...img })),
      );
      setThread(currentThread.clone());
    } else if (capability === Capability.IMAGE_EDIT) {
      if (!image?.data) {
        return;
      }
      const editedImage = await api.editImage(provider, model, prompt, image.data);
      currentThread.appendPartsToMessage(assistantMessage.getId(), [
        { kind: "image" as const, ...editedImage },
      ]);
      setThread(currentThread.clone());
    } else if (capability === Capability.VIDEO_GENERATION) {
      const videos = await api.generateVideo(provider, model, prompt, image?.data);
      currentThread.appendPartsToMessage(
        assistantMessage.getId(),
        videos.map((v) => ({ kind: "video" as const, ...v })),
      );
      setThread(currentThread.clone());
    } else if (capability === Capability.TEXT_TO_SPEECH) {
      const audio = await api.generateAudio(provider, model, prompt);
      currentThread.appendPartsToMessage(assistantMessage.getId(), [
        { kind: "audio" as const, ...audio },
      ]);
      setThread(currentThread.clone());
    }

    if (activeConversationId) {
      await repository.saveThread(currentThread, activeConversationId);
      setThread(currentThread.clone());
    }
  };

  return {
    thread,
    conversationId,
    loadThread,
    saveThread,
    sendMessage,
    initThread,
  };
}
