import textIcon from "../../assets/icons/text.svg?url";
import imageIcon from "../../assets/icons/image.svg?url";
import videoIcon from "../../assets/icons/video.svg?url";
import audioIcon from "../../assets/icons/audio.svg?url";
import styles from "./ChatInput.module.css";

import type { ReactNode } from "react";
import { Capability } from "../../core/enums";

type Props = {
  selected: Capability;
  onSelect: (cap: Capability) => void;
  showText?: boolean;
  showImage?: boolean;
  showVideo?: boolean;
  showAudio?: boolean;
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
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`${styles.capabilityBtn} ${active ? styles.capabilityBtnActive : ""}`}
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
  showAudio = true,
}: Props) {
  return (
    <div className={styles.leftActions}>
      {showText && (
        <CapabilityButton
          active={selected === Capability.TEXT_GENERATION}
          onClick={() => onSelect(Capability.TEXT_GENERATION)}
          title="Text"
          ariaLabel="Text capability"
        >
          <img src={textIcon} width={18} height={18} alt="" aria-hidden />
        </CapabilityButton>
      )}
      {showImage && (
        <CapabilityButton
          active={selected === Capability.IMAGE_GENERATION}
          onClick={() => onSelect(Capability.IMAGE_GENERATION)}
          title="Image"
          ariaLabel="Image capability"
        >
          <img src={imageIcon} width={18} height={18} alt="" aria-hidden />
        </CapabilityButton>
      )}
      {showVideo && (
        <CapabilityButton
          active={selected === Capability.VIDEO_GENERATION}
          onClick={() => onSelect(Capability.VIDEO_GENERATION)}
          title="Video"
          ariaLabel="Video capability"
        >
          <img src={videoIcon} width={18} height={18} alt="" aria-hidden />
        </CapabilityButton>
      )}
      {showAudio && (
        <CapabilityButton
          active={selected === Capability.TEXT_TO_SPEECH}
          onClick={() => onSelect(Capability.TEXT_TO_SPEECH)}
          title="Audio"
          ariaLabel="Audio capability"
        >
          <img src={audioIcon} width={18} height={18} alt="" aria-hidden />
        </CapabilityButton>
      )}
    </div>
  );
}
