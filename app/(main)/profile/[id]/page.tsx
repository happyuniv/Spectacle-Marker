'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { Pencil } from 'lucide-react'

import { useGetUserById, useGetUserPosts } from '@/lib/react-query/queries'
import { useUserContext } from '@/contexts/AuthContext'
import { Loader, PostList } from '@/components/index'

export default function Page() {
  const [tab, setTab] = useState('posts')

  const { user } = useUserContext()
  const params = useParams<{ id: string }>()
  const { data: currentUser } = useGetUserById(params.id || '')
  const { data: userPosts } = useGetUserPosts(params.id)

  if (!currentUser)
    return (
      <div className='flex-center w-full h-full'>
        <Loader />
      </div>
    )

  return (
    <>
      <div className='px-12 py-10 w-full'>
        <div className='flex flex-col w-full'>
          <div className='flex gap-5'>
            <div className='relative w-[200px] h-[200px]'>
              <Image
                src={currentUser.imageUrl}
                fill
                alt='profile'
                className='rounded-full object-cover'
              />
            </div>
            <div className='flex flex-col justify-between'>
              <div className='flex flex-col gap-2'>
                <span className='text-2xl font-bold'>
                  @{currentUser.username}
                </span>
                <span className='text-lg text-gray-500'>
                  {currentUser.email}
                </span>
              </div>
              <div>
                <span className='text-xl font-bold'>
                  {currentUser.posts.length}
                </span>{' '}
                <span className='text-gray-500'>포스팅</span>
              </div>
            </div>
            {user.id === currentUser.$id && (
              <Link
                href={`/profile/${params.id}/edit`}
                className='ml-auto self-center'
              >
                <Pencil />
              </Link>
            )}
          </div>
          <div className='flex gap-3 mt-5'>
            <button
              onClick={() => setTab('posts')}
              className={`${
                tab === 'posts' && 'border-b-4 border-b-gray-500'
              } p-2 border-b rounded-lg`}
            >
              포스팅 목록
            </button>
            <button
              onClick={() => setTab('likes')}
              className={`${
                tab === 'likes' && 'border-b-4 border-b-gray-500'
              } p-2 border-b rounded-lg`}
            >
              좋아요 목록
            </button>
          </div>
          {tab === 'posts' && userPosts && (
            <PostList posts={userPosts.documents} />
          )}
          {tab === 'likes' && (
            <PostList posts={currentUser.liked} showStats={false} />
          )}
        </div>
      </div>
    </>
  )
}
