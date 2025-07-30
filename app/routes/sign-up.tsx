import { SignUp } from '@clerk/react-router';

export function meta() {
  return [
    { title: 'Genii | Sign Up' },
    { name: 'description', content: 'Sign up to Genii!' },
  ];
}

export default function SignUpPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignUp />
    </div>
  );
}
