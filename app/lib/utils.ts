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

export function generateCourseRecommendationPrompt(formData: {
  learningGoals: string[];
  goal: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  languagePreference: 'id' | 'en' | 'mix';
  explanationStyle: string;
}): string {
  // Map language preference values to descriptive text
  const languageMap: Record<string, string> = {
    id: 'Indonesian language',
    en: 'English language',
    mix: 'mixed Indonesian and English languages',
  };

  // Map explanation style values to descriptive text
  const explanationStyleMap: Record<string, string> = {
    simple: 'simple and direct explanations',
    detailed: 'detailed and comprehensive explanations with examples',
    visual:
      'visual and interactive learning with diagrams and hands-on approach',
    conversational: 'conversational and friendly explanations',
  };

  // Map level values to descriptive text
  const levelMap: Record<string, string> = {
    beginner: 'beginner level with little to no prior knowledge',
    intermediate: 'intermediate level with some basic understanding',
    advanced: 'advanced level with existing experience and knowledge',
  };

  // Generate the prompt
  const prompt = `Recommend courses for someone focused on learning ${formData.learningGoals.join(', ')}.
Their specific learning goal is: "${formData.goal}".
Their current knowledge level is ${levelMap[formData.level] || formData.level}.
They prefer content in ${languageMap[formData.languagePreference] || formData.languagePreference} with ${explanationStyleMap[formData.explanationStyle] || formData.explanationStyle}.
Suggest relevant courses that match these learning preferences, goals, and preferred learning style.`;

  return prompt;
}
