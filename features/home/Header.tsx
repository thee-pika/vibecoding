import Image from 'next/image';
import React from 'react'
import User from '../auth/components/User';

const Header = () => {

    return (
        <>
            <div className='h-[80px] bg-gradient-to-br from-gray-900 to-black text-white font-sans'>
                <div className='container mx-auto px-4 flex justify-between items-center'>
                    <div className='flex items-center p-4'>
                        <Image src={"/main-logo.png"} alt="logo" width={50} height={50} />
                        <h1 className='text-2xl font-bold ml-4 text-gray-300'>code<span className='text-gray-50 font-bold'>X</span></h1>
                    </div>
                    <div>
                        <User />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header;
