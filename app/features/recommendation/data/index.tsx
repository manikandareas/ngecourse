import { defineQuery } from 'groq';
import { client } from '~/lib/sanity-client';

export const recommendationQuery = defineQuery(`
  *[_type == "recommendation" && createdFor._ref == $userId][0]{
    _id,
    _type,
    _createdAt,
    _updatedAt,
    query,
    reason,
    status,
    message,
    "courses": courses[]->{
      _id,
      title,
      "slug": slug.current,
      "topics": topics[]->,
      description,
      difficulty,
      thumbnail,
      trailer
    }
  }
`);

const getRecommendationForUser = async (userId: string) => {
  try {
    return await client.fetch(recommendationQuery, { userId });
  } catch (error) {
    throw new Error(
      `Failed to fetch recommendation: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export const dataRecommendation = {
  forUser: getRecommendationForUser,
};
