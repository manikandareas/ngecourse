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
  studyReason: string;
  studyPlan: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}): string {
  // Map study reason values to descriptive text
  const studyReasonMap: Record<string, string> = {
    'career-switch': 'switching to a tech career',
    'skill-upgrade': 'upgrading current tech skills',
    certification: 'obtaining professional certification',
    freelancing: 'working on freelancing and side projects',
    entrepreneurship: 'tech entrepreneurship',
    'personal-projects': 'building personal projects',
  };

  // Map study plan values to descriptive text
  const studyPlanMap: Record<string, string> = {
    intensive: 'intensive full-time learning schedule',
    structured: 'structured learning with regular weekly sessions',
    'project-based': 'project-based learning through hands-on building',
    flexible: 'flexible learning that adapts to their schedule',
  };

  // Map level values to descriptive text
  const levelMap: Record<string, string> = {
    beginner: 'beginner level with little to no prior knowledge',
    intermediate: 'intermediate level with some basic understanding',
    advanced: 'advanced level with existing experience and knowledge',
  };

  // Generate the prompt
  const prompt = `Recommend courses for someone interested in learning ${formData.learningGoals.join(', ')}.
They are ${studyReasonMap[formData.studyReason] || formData.studyReason}.
They prefer a ${studyPlanMap[formData.studyPlan] || formData.studyPlan} approach.
Their current knowledge level is ${levelMap[formData.level] || formData.level}.
Suggest relevant courses that match these learning preferences and goals.`;

  return prompt;
}
