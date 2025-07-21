import { verifyWebhook } from '@clerk/react-router/webhooks';
import { usecaseUser } from '~/usecase/users';
import type { Route } from './+types/webhooks';

export const action = async ({ request }: Route.ActionArgs) => {
  try {
    const evt = await verifyWebhook(request);

    const eventType = evt.type;

    console.log('Webhook payload:', evt.data);

    switch (eventType) {
      case 'user.created': {
        usecaseUser.userCreated(evt.data);
        break;
      }
      case 'session.created':
        console.log('NGAPAIN KEK');
        break;

      default:
        break;
    }
    return new Response('Webhook received', { status: 200 });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
};
