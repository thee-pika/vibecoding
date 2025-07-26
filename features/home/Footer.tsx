import React from 'react'

const Footer = () => {
  return (
    <div className='h-[60px] bg-gradient-to-br from-gray-900 to-black text-white font-sans'>
      <div className='container mx-auto px-4 h-full'>
        <div className='flex items-center p-4 justify-between'>
          <h1 className='text-2xl font-bold ml-4 text-gray-300'>code<span className='text-gray-50 font-bold'>X</span></h1>
          <h2 className='text-gray-500 ml-4'> &copy; 2025 All Rights Reserved </h2>
        </div>
      </div>
    </div>
  )
}

export default Footer