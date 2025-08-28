export type RecommendationStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface RecommendationData {
  _id: string;
  _type: 'recommendation';
  _createdAt: string;
  _updatedAt: string;
  query?: string;
  reason?: string;
  status?: 'completed' | 'failed' | 'in_progress' | null;
  message?: string | null;
  courses: Array<{
    _id: string;
    title: string | null;
    slug: string | null;
    topics?: unknown[];
    description: string | null;
    difficulty: "beginner" | "intermediate" | "advanced" | null;
    thumbnail: unknown;
    trailer: string | null;
  }>;
}

export interface UseRecommendationDataReturn {
  data: RecommendationData | null;
  status: RecommendationStatus;
  message: string;
  isLoading: boolean;
  error: Error | null;
}

export const DEFAULT_MESSAGE_MAP: Record<RecommendationStatus, string> = {
  pending: 'Analyzing your learning preferences...',
  processing: 'Finding the perfect courses for you...',
  completed: 'Your personalized learning path is ready!',
  failed: 'Unable to generate recommendations at this time.',
};

// Map Sanity status to our status type
export function mapSanityStatus(sanityStatus?: string | null): RecommendationStatus {
  switch (sanityStatus) {
    case 'in_progress':
      return 'processing';
    case 'completed':
      return 'completed';
    case 'failed':
      return 'failed';
    default:
      return 'pending';
  }
}