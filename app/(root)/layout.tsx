import Footer from '@/features/home/Footer'
import Header from '@/features/home/Header'
import React from 'react'

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
    <Header/>
    <main>
        {children}
    </main>
    <Footer/>
    </>
  )
}

export default HomeLayout;
