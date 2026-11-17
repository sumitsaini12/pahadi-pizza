const dateFormat = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });

export const formatPostDate = (iso: string) => dateFormat.format(new Date(iso));

/** First line of a caption, without hashtags, for compact labels. */
export function captionHeadline(caption?: string, max = 90) {
  if (!caption) return '';
  const firstLine = caption.split('\n').find((l) => l.replace(/#\S+/g, '').trim()) ?? '';
  const clean = firstLine.replace(/#\S+/g, '').replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}
