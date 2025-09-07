export enum MediaMimeType {
  // Images
  IMAGE_PNG = "image/png",
  IMAGE_JPEG = "image/jpeg",
  IMAGE_WEBP = "image/webp",
  IMAGE_GIF = "image/gif",

  // Videos
  VIDEO_MP4 = "video/mp4",
  VIDEO_WEBM = "video/webm",
  VIDEO_OGG = "video/ogg",

  // Audio
  AUDIO_WAV = "audio/wav",
  AUDIO_MP3 = "audio/mp3",
  AUDIO_OGG = "audio/ogg",
  AUDIO_WEBM = "audio/webm",
}

export function getMimeTypeForKind(kind: string): MediaMimeType {
  const defaults: Record<string, MediaMimeType> = {
    image: MediaMimeType.IMAGE_PNG,
    video: MediaMimeType.VIDEO_MP4,
    audio: MediaMimeType.AUDIO_WAV,
  };
  return defaults[kind] || MediaMimeType.IMAGE_PNG;
}
