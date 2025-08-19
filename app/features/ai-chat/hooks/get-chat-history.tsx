import { queryOptions, useQuery } from '@tanstack/react-query';
import { dataAiChat } from '../data';

export const chatHistoryQueryOption = (userId: string, lessonId: string) =>
  queryOptions({
    queryKey: ['chat-history', lessonId],
    queryFn: async () => await dataAiChat.getChatHistory({ userId, lessonId }),
  });

export const useChatHistory = (userId: string, lessonId: string) =>
  useQuery(chatHistoryQueryOption(userId, lessonId));
