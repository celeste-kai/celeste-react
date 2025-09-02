export default function VideoPart({ url, path }: { url?: string; path?: string }) {
  const src = url || path;

  if (!src) {
    return null;
  }

  return <video src={src} controls playsInline style={{ maxWidth: "100%" }} />;
}
