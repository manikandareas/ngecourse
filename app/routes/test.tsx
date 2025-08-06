import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';
import { getCurrentSession } from '~/root';
import type { Route } from './+types/test';

export async function loader(args: Route.LoaderArgs) {
  const session = await getCurrentSession(args);
  if (!session) {
    throw new Response('Unauthorized', { status: 401 });
  }
  const token = await session.getToken();

  if (!token) {
    throw new Response('Unauthorized', { status: 401 });
  }
  return token;
}

export default function Page(props: Route.ComponentProps) {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: 'http://localhost:4000/api/chat',
      body: {
        lessonId: 'lesson-go-api-endpoints',
      },
      headers: {
        Authorization: `Bearer ${props.loaderData}`,
      },
    }),
  });
  const [input, setInput] = useState('');

  return (
    <>
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) =>
            part.type === 'text' ? (
              <span key={index.toString()}>{part.text}</span>
            ) : null
          )}
        </div>
      ))}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput('');
          }
        }}
      >
        <input
          disabled={status !== 'ready'}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Say something..."
          value={input}
        />
        <button disabled={status !== 'ready'} type="submit">
          Submit
        </button>
      </form>
    </>
  );
}
