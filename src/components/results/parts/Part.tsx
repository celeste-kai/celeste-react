import type { ContentPart } from "../../../domain/types";
import { getMimeTypeForKind } from "../../../core/enums";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AudioPart from "./AudioPart";

interface PartProps {
  part: ContentPart;
}

export default function Part({ part }: PartProps) {
  if (part.kind === "text") {
    return <ReactMarkdown remarkPlugins={[remarkGfm]}>{part.content}</ReactMarkdown>;
  }

  const src =
    part.path ??
    (part.data ? `data:${getMimeTypeForKind(part.kind)};base64,${part.data}` : null);

  if (!src) return null;

  switch (part.kind) {
    case "image":
      return <img src={src} alt="content" />;
    case "video":
      return <video src={src} controls playsInline />;
    case "audio":
      return <AudioPart src={src} />;
    default:
      return null;
  }
}
