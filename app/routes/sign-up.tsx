import { SignUp } from '@clerk/react-router';

export function meta() {
  return [
    { title: 'Genii | Sign Up' },
    { name: 'description', content: 'Sign up to Genii!' },
  ];
}

export default function SignUpPage() {
  return (
    <div className="cosmic-bg flex min-h-screen items-center justify-center p-4">
      <div className="glass-card w-full max-w-md">
        <SignUp />
      </div>
    </div>
  );
}
