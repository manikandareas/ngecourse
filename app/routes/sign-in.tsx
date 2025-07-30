import { SignIn } from '@clerk/react-router';

export function meta() {
  return [
    { title: 'Genii | Sign In' },
    { name: 'description', content: 'Sign in to Genii!' },
  ];
}

export default function SignInPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignIn />
    </div>
  );
}
