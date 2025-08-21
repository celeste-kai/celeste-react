import React from 'react';
import textIcon from '../../assets/icons/text.svg?url';
import imageIcon from '../../assets/icons/image.svg?url';
import videoIcon from '../../assets/icons/video.svg?url';
import styles from './ChatInput.module.css';

type Capability = 'text' | 'image' | 'video';

type Props = {
  selected: Capability;
  onSelect: (cap: Capability) => void;
  showText?: boolean;
  showImage?: boolean;
  showVideo?: boolean;
};

// Icons moved to ../icons components to keep this component small

function CapabilityButton({
  active,
  onClick,
  title,
  ariaLabel,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`${styles.capabilityBtn} ${active ? styles.capabilityBtnActive : ''}`}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

export default function CapabilityButtons({
  selected,
  onSelect,
  showText = true,
  showImage = true,
  showVideo = true,
}: Props) {
  return (
    <div className={styles.leftActions}>
      {showText && (
        <CapabilityButton
          active={selected === 'text'}
          onClick={() => onSelect('text')}
          title="Text"
          ariaLabel="Text capability"
        >
          <img src={textIcon} width={18} height={18} alt="" aria-hidden />
        </CapabilityButton>
      )}
      {showImage && (
        <CapabilityButton
          active={selected === 'image'}
          onClick={() => onSelect('image')}
          title="Image"
          ariaLabel="Image capability"
        >
          <img src={imageIcon} width={18} height={18} alt="" aria-hidden />
        </CapabilityButton>
      )}
      {showVideo && (
        <CapabilityButton
          active={selected === 'video'}
          onClick={() => onSelect('video')}
          title="Video"
          ariaLabel="Video capability"
        >
          <img src={videoIcon} width={18} height={18} alt="" aria-hidden />
        </CapabilityButton>
      )}
    </div>
  );
}
