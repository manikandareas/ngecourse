import { defineQuery } from 'groq';
import type { User } from 'sanity.types';
import { client } from '~/lib/sanity-client';

interface CreateUser {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  clerkId: string;
  onboardingStatus?: 'not_started' | 'completed';
}

const create = async (user: CreateUser) => {
  try {
    return await client.create({
      _type: 'user',
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      clerkId: user.clerkId,
      onboardingStatus: user.onboardingStatus || 'not_started',
    });
  } catch (error) {
    throw new Error(
      `Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const findOneByEmail = async (email: string) => {
  const findByEmailQuery = defineQuery(`
    *[_type == "user" && email == $email][0]
  `);

  try {
    return await client.fetch(findByEmailQuery, { email });
  } catch (error) {
    throw new Error(
      `Failed to find user by email: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const findOneByClerkId = async (clerkId: string) => {
  const findByClerkIdQuery = defineQuery(`
    *[_type == "user" && clerkId == $clerkId][0]
  `);

  try {
    return await client.fetch(findByClerkIdQuery, { clerkId });
  } catch (error) {
    throw new Error(
      `Failed to find user by clerk ID: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const findOneByUsername = async (username: string) => {
  const findByUsernameQuery = defineQuery(`
    *[_type == "user" && username == $username][0]
  `);

  try {
    return await client.fetch(findByUsernameQuery, { username });
  } catch (error) {
    throw new Error(
      `Failed to find user by username: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

const updateOnboardingStatus = async (
  userId: string,
  status: 'not_started' | 'completed'
) => {
  try {
    return await client
      .patch(userId)
      .set({ onboardingStatus: status })
      .commit();
  } catch (error) {
    throw new Error(
      `Failed to update onboarding status: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export type UpdateUserInput = Pick<
  User,
  | 'username'
  | 'firstname'
  | 'lastname'
  | 'onboardingStatus'
  | 'email'
  | 'learningGoals'
  | 'level'
  | 'streakStartDate'
  | 'studyPlan'
  | 'studyReason'
  | 'studyStreak'
>;

const updateUser = async (userId: string, data: Partial<UpdateUserInput>) => {
  try {
    return await client.patch(userId).set(data).commit();
  } catch (error) {
    throw new Error(
      `Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export const dataUser = {
  createOne: create,
  updateOne: updateUser,
  findOneByEmail,
  findOneByClerkId,
  findOneByUsername,
  updateOnboardingStatus,
};
