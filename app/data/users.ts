import { createUser, login, readUsers } from '@directus/sdk';
import { directusAuthclient, directusClient } from '~/lib/directus-client';

interface CreateUser {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  avatarUrl: string;
  clerkId: string;
}

const create = async (user: CreateUser) => {
  return await directusClient.request(
    createUser({
      first_name: user.first_name,
      last_name: user.last_name,
      //   avatar: user.avatarUrl,
      email: user.email,
      password: user.password,
      clerk_id: user.clerkId,
    })
  );
};

const userLogin = async (user: { email: string; password: string }) => {
  return await directusAuthclient.request(
    login({
      email: user.email,
      password: user.password,
    })
  );
};

const findOneByEmail = async (email: string) => {
  return await directusClient
    .request(
      readUsers({
        filter: {
          email: {
            _eq: email,
          },
        },
      })
    )
    .then((res) => (res.length > 0 ? res[0] : null));
};

const findOneByClerkId = async (clerkId: string) => {
  return await directusClient
    .request(
      readUsers({
        filter: {
          clerk_id: {
            _eq: clerkId,
          },
        },
      })
    )
    .then((res) => (res.length > 0 ? res[0] : null));
};

export const dataUser = {
  createOne: create,
  login: userLogin,
  findOneByEmail,
  findOneByClerkId,
};
