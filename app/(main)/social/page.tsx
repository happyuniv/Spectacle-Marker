'use client'

import Image from 'next/image'
import Link from 'next/link'

import { useGetUsers } from '@/lib/react-query/queries'
import { Loader } from '@/components/index'

export default function Page() {
  const { data: creators, isLoading, isError } = useGetUsers()

  return (
    <>
      <div className='px-12 py-10 w-full'>
        <div className='w-full'>
          <h2 className='text-3xl font-bold'>소셜</h2>
          {isLoading && <Loader />}
          {!isLoading && !isError && (
            <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 py-10 gap-7 w-full max-w-5xl'>
              {creators?.documents.map((creator) => (
                <li
                  key={creator.$id}
                  className='flex flex-col justify-center items-center gap-3 min-w-80 xl:min-w-72 h-60 border rounded-xl'
                >
                  <Link href={`/profile/${creator.$id}`}>
                    <Image
                      src={creator.imageUrl}
                      width={64}
                      height={64}
                      alt='profile_image'
                      className='rounded-full'
                    />
                  </Link>
                  <span>{creator.username}</span>
                  <span>{creator.email}</span>
                  <div>
                    <span className='text-lg font-bold'>
                      {creator.posts.length}
                    </span>
                    <span>개의 포스팅</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
