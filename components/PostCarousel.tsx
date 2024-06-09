'use client'

import * as React from 'react'
import Image from 'next/image'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

type props = {
  imageUrls: string[]
}

export default function PostCarousel({ imageUrls }: props) {
  return (
    <Carousel className='mt-5'>
      <CarouselContent>
        {imageUrls.map((url, index) => (
          <CarouselItem key={index}>
            <div className='relative w-full max-h-[480px] border rounded-3xl bg-black bg-opacity-5 aspect-square'>
              <Image src={url} fill alt='' className='object-contain' />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
