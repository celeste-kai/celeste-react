import type { ImagePart, ThreadItem, VideoPart } from "../../domain/thread";

export function selectAllImages(items: ThreadItem[]): ImagePart[] {
  const acc: ImagePart[] = [];
  for (const it of items) {
    for (const p of it.parts) {
      if (p.kind === "image") {
        acc.push(p as ImagePart);
      }
    }
  }
  return acc;
}

export function selectAllVideos(items: ThreadItem[]): VideoPart[] {
  const acc: VideoPart[] = [];
  for (const it of items) {
    for (const p of it.parts) {
      if (p.kind === "video") {
        acc.push(p as VideoPart);
      }
    }
  }
  return acc;
}
