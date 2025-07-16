import { SignUp } from '@clerk/react-router';


export function meta() {
    return [
        { title: 'NgeCourse | Sign Up' },
        { name: 'description', content: 'Sign up to NgeCourse!' },
    ];
}

export default function SignUpPage() {
    return (
        <div className='flex h-screen items-center justify-center'>
            <SignUp />
        </div>
    );
}
