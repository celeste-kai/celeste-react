import React from 'react';
import styles from '../chat/ChatInput.module.css';
import { ProviderSelect } from '../controls/ProviderSelect';
import { ModelSelect } from '../controls/ModelSelect';
import CapabilityButtons from '../chat/CapabilityButtons';
import type { ModelOut, ProviderOut } from '../../types/api';

type Props = {
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSend: (prompt: string) => void;
  onRefresh: () => void;
  selectedModel: string;
  onChangeModel: (value: string | null) => void;
  models?: ModelOut[];
  isLoadingModels?: boolean;
  selectedCapability: 'text' | 'image' | 'video';
  onSelectCapability: (cap: 'text' | 'image' | 'video') => void;
  providers?: ProviderOut[];
  selectedProvider: string;
  onChangeProvider: (value: string | null) => void;
  showText?: boolean;
  showImage?: boolean;
  showVideo?: boolean;
};

export default function InputBar({
  inputValue,
  onInputChange,
  onKeyPress,
  onSend,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onRefresh,
  selectedModel,
  onChangeModel,
  models = [],
  isLoadingModels = false,
  selectedCapability,
  onSelectCapability,
  providers = [],
  selectedProvider,
  onChangeProvider,
  showText = true,
  showImage = true,
  showVideo = true,
}: Props) {
  const placeholder =
    selectedCapability === 'image'
      ? "Décrivez l'image à générer…"
      : selectedCapability === 'video'
        ? 'Décrivez la vidéo à générer…'
        : 'Comment puis-je vous aider ?';
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.inputRow}>
          <input
            type="text"
            className={styles.textInput}
            placeholder={placeholder}
            value={inputValue}
            onChange={onInputChange}
            onKeyPress={onKeyPress}
          />
        </div>

        <div className={styles.actionsRow}>
          <CapabilityButtons
            selected={selectedCapability}
            onSelect={onSelectCapability}
            showText={showText}
            showImage={showImage}
            showVideo={showVideo}
          />

          <div className={styles.rightActions}>
            <ProviderSelect
              providers={providers}
              value={selectedProvider}
              onChange={(next) => onChangeProvider(next)}
            />
            <ModelSelect
              models={models}
              value={selectedModel}
              onChange={(id) => onChangeModel(id)}
              isLoading={isLoadingModels}
            />
            <button
              className={styles.sendBtn}
              onClick={() => onSend(inputValue)}
              title="Send message"
              type="button"
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
