import { defineQuery } from 'groq';
import { client } from '~/lib/sanity-client';

type GetChatHistoryProps = {
  userId: string;
  lessonId: string;
};

const getChatHistory = async ({ userId, lessonId }: GetChatHistoryProps) => {
  const chatHistoryQuery = defineQuery(
    `*[_type == "chatMessage" &&
    session._ref in *[_type == "chatSession" &&
      $userId in users[]._ref &&
      $lessonId in lessons[]._ref &&
      status == "active"]._id
  ] | order(_createdAt asc) {
    _id,
    messageId,
    role,
    parts,
    metadata,
    session->{
      _id,
      sessionId,
      status
    }
  }`
  );
  try {
    return await client.fetch(chatHistoryQuery, { userId, lessonId });
  } catch (error) {
    throw new Error(
      `Failed to fetch chat history: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export const dataAiChat = {
  getChatHistory,
};
