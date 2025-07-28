import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

const AddNewRepo = () => {
  return (
    <>
      <div className='hover:bg-gray-700 bg-gray-900 flex justify-evenly pt-8'>
        <div className='flex items-center justify-center gap-10'>
          <Button>
            <ArrowDown size={30} className="transition-transform duration-300 group-hover:translate-y-1" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-[#e93f3f]">Open Github Repository</h1>
            <p className="text-sm text-muted-foreground max-w-[220px]">Work with your repositories in our editor</p>
          </div>
        </div>
 
        <div className="relative overflow-hidden flex justify-center items-center">
          <Image
            src={"/github.svg"}
            alt="Open GitHub repository"
            width={100}
            height={100}
            className="transition-transform duration-300  group-hover:scale-110"
          />
        </div>
      </div>
    </>
  )
}

export default AddNewRepo;
