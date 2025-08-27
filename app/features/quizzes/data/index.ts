import { defineQuery } from 'groq';
import { client } from '~/lib/sanity-client';
import type { QuizAttempt } from 'sanity.types';

const getQuizBySlug = async (slug: string) => {
  const quizQuery = defineQuery(`
    *[_type == "quiz" && slug.current == $slug][0]{
      _id,
      _type,
      _createdAt,
      _updatedAt,
      title,
      "slug": slug.current,
      description,
      maxAttempt,
      questions[]{
        _key,
        question,
        options,
        correctOptionIndex,
        explanation
      }
    }
  `);
  
  try {
    return await client.fetch(quizQuery, { slug });
  } catch (error) {
    throw new Error(`Failed to fetch quiz: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const getQuizAttempt = async (attemptId: string, userId: string) => {
  const attemptQuery = defineQuery(`
    *[_type == "quizAttempt" && _id == $attemptId && user[0]._ref == $userId][0]{
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      attemptNumber,
      status,
      answers[]{
        _key,
        questionIndex,
        selectedOptionIndex,
        isOutcome,
        timeTakenMs
      },
      correctCount,
      totalQuestions,
      score,
      percentage,
      startedAt,
      submittedAt,
      durationMs,
      feedback,
      "quiz": quiz[0]->{
        _id,
        title,
        "slug": slug.current,
        description,
        questions[]{
          _key,
          question,
          options,
          correctOptionIndex,
          explanation
        }
      },
      "course": course[0]->{
        _id,
        title,
        "slug": slug.current
      },
      "chapter": chapter[0]->{
        _id,
        title,
        "slug": slug.current
      }
    }
  `);
  
  try {
    return await client.fetch(attemptQuery, { attemptId, userId });
  } catch (error) {
    throw new Error(`Failed to fetch quiz attempt: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const getUserQuizAttempts = async (userId: string, quizId: string) => {
  const attemptsQuery = defineQuery(`
    *[_type == "quizAttempt" && 
      user[0]._ref == $userId && 
      quiz[0]._ref == $quizId] | order(_createdAt desc){
      _id,
      attemptNumber,
      status,
      percentage,
      correctCount,
      totalQuestions,
      _createdAt,
      submittedAt
    }
  `);
  
  try {
    return await client.fetch(attemptsQuery, { userId, quizId });
  } catch (error) {
    throw new Error(`Failed to fetch user quiz attempts: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export interface CreateQuizAttemptData {
  userId: string;
  quizId: string;
  courseId: string;
  chapterId: string;
  attemptNumber: number;
  totalQuestions: number;
}

const createQuizAttempt = async (data: CreateQuizAttemptData) => {
  try {
    return await client.create({
      _type: 'quizAttempt',
      user: [{ _type: 'reference', _ref: data.userId }],
      quiz: [{ _type: 'reference', _ref: data.quizId }],
      course: [{ _type: 'reference', _ref: data.courseId }],
      chapter: [{ _type: 'reference', _ref: data.chapterId }],
      attemptNumber: data.attemptNumber,
      status: 'in_progress',
      answers: [],
      startedAt: new Date().toISOString(),
      totalQuestions: data.totalQuestions
    });
  } catch (error) {
    throw new Error(`Failed to create quiz attempt: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const updateQuizAttempt = async (attemptId: string, updates: Partial<QuizAttempt>) => {
  try {
    return await client.patch(attemptId).set(updates).commit();
  } catch (error) {
    throw new Error(`Failed to update quiz attempt: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const dataQuizzes = {
  getQuizBySlug,
  getQuizAttempt,
  getUserQuizAttempts,
  createQuizAttempt,
  updateQuizAttempt
};