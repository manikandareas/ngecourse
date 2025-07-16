import { SignIn } from "@clerk/react-router";


export function meta() {
    return [
        { title: 'NgeCourse | Sign In' },
        { name: 'description', content: 'Sign in to NgeCourse!' },
    ];
}

export default function SignInPage() {
    return (
        <div className='flex h-screen items-center justify-center'>
            <SignIn />
        </div>
    );
}
