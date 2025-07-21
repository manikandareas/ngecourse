import type { UserJSON } from '@clerk/backend';
import { dataUser } from '~/data/users';

const userCreated = async (user: UserJSON) => {
  return await dataUser.createOne({
    email: user.email_addresses[0].email_address as string,
    password: user.id,
    first_name: user.first_name || 'John',
    last_name: user.last_name || 'Doe',
    avatarUrl: user.image_url as string,
    clerkId: user.id,
  });
};

const getCurrentUser = async (clerkId: string) => {
  return await dataUser.findOneByClerkId(clerkId);
};

export const usecaseUser = {
  userCreated,

  getCurrentUser,
};
