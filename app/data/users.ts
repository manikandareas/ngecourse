import { defineQuery } from 'groq';
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
  return await client.create({
    _type: 'user',
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    clerkId: user.clerkId,
    onboardingStatus: user.onboardingStatus || 'not_started'
  });
};

const findOneByEmail = async (email: string) => {
  const findByEmailQuery = defineQuery(`
    *[_type == "user" && email == $email][0]
  `);
  
  return await client.fetch(findByEmailQuery, { email });
};

const findOneByClerkId = async (clerkId: string) => {
  const findByClerkIdQuery = defineQuery(`
    *[_type == "user" && clerkId == $clerkId][0]
  `);
  
  return await client.fetch(findByClerkIdQuery, { clerkId });
};

const findOneByUsername = async (username: string) => {
  const findByUsernameQuery = defineQuery(`
    *[_type == "user" && username == $username][0]
  `);
  
  return await client.fetch(findByUsernameQuery, { username });
};

const updateOnboardingStatus = async (userId: string, status: 'not_started' | 'completed') => {
  return await client
    .patch(userId)
    .set({ onboardingStatus: status })
    .commit();
};

export const dataUser = {
  createOne: create,
  findOneByEmail,
  findOneByClerkId,
  findOneByUsername,
  updateOnboardingStatus,
};
