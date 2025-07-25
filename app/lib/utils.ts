/** biome-ignore-all lint/performance/useTopLevelRegex: false positive */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractYoutubeId = (url: string) => {
  // Handle YouTube embed URLs: https://www.youtube.com/embed/VIDEO_ID
  const embedRegex = /\/embed\/([a-zA-Z0-9_-]+)/;
  const embedMatch = url.match(embedRegex);
  if (embedMatch) {
    return embedMatch[1];
  }

  // Handle YouTube watch URLs: https://www.youtube.com/watch?v=VIDEO_ID
  const watchRegex = /[?&]v=([a-zA-Z0-9_-]+)/;
  const watchMatch = url.match(watchRegex);
  if (watchMatch) {
    return watchMatch[1];
  }

  // Handle YouTube short URLs: https://youtu.be/VIDEO_ID
  const shortRegex = /youtu\.be\/([a-zA-Z0-9_-]+)/;
  const shortMatch = url.match(shortRegex);
  if (shortMatch) {
    return shortMatch[1];
  }

  return null;
};
