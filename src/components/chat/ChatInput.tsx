import React from 'react';
// import IconButton from '../common/IconButton';
import styles from './ChatInput.module.css';
import { ProviderSelect } from '../controls/ProviderSelect';
import { ModelSelect } from '../controls/ModelSelect';
import CapabilityButtons from './CapabilityButtons';
import type { ModelOut } from '../../hooks/useModels';
import type { ProviderOut } from '../../types/api';

type ChatInputProps = {
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onRefresh: () => void; // currently unused, reserved for future actions
  selectedModel: string;
  onChangeModel: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  models?: ModelOut[];
  isLoadingModels?: boolean;
  selectedCapability: 'text' | 'image' | 'video';
  onSelectCapability: (cap: 'text' | 'image' | 'video') => void;
  providers?: ProviderOut[];
  selectedProvider: string;
  onChangeProvider: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  showText?: boolean;
  showImage?: boolean;
  showVideo?: boolean;
};

function ChatInput({
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
}: ChatInputProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.inputRow}>
          <input
            type="text"
            className={styles.textInput}
            placeholder="Comment puis-je vous aider ?"
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
              onChange={(next) =>
                onChangeProvider({
                  target: { value: next },
                } as React.ChangeEvent<HTMLSelectElement>)
              }
            />
            <ModelSelect
              models={models}
              value={selectedModel}
              onChange={(id) =>
                onChangeModel({ target: { value: id } } as React.ChangeEvent<HTMLSelectElement>)
              }
              isLoading={isLoadingModels}
            />

            <button className={styles.sendBtn} onClick={onSend} title="Send message" type="button">
              ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
