import { SignIn } from '@clerk/react-router';

export function meta() {
  return [
    { title: 'Genii | Sign In' },
    { name: 'description', content: 'Sign in to Genii!' },
  ];
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 cosmic-bg">
      <div className="glass-card w-full max-w-md">
        <SignIn />
      </div>
    </div>
  );
}
