import SignInForm from '@/features/auth/components/SignInForm';
import Image from 'next/image';
import React from 'react'

const SignInPage = () => {
    return (
        <>
            <div className='flex flex-col items-center '>
                <img
                    src="/logo.svg"
                    alt="logo"
                    width={300}
                    height={300}
                    className="mb-10"
                />
                <SignInForm />
            </div>
        </>
    )
}

export default SignInPage;
