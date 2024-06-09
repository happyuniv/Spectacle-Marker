'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { Models } from 'appwrite'

import { formatDate } from '@/lib/utils'
import PostCarousel from '@/components/PostCarousel'
import PostStats from '@/components/PostStats'
import ToggleMap from './ToggleMap'
import PostDotMenu from './PostDotMenu'

type props = {
  post: Models.Document
}

export default function PostCard({ post }: props) {
  return (
    <>
      <div id={post.$id} className='flex gap-3'>
        <Link href={`/profile/${post.creator.$id}`}>
          <Image
            src={post.creator.imageUrl}
            width={48}
            height={48}
            alt='profile'
            className='rounded-full'
          />
        </Link>
        <div className='w-full'>
          <div className='flex justify-between'>
            <Link href={`/profile/${post.creator.$id}`}>
              <span className='text-lg'>{post.creator.username}</span>
            </Link>
            <PostDotMenu post={post} />
          </div>
          <div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500'>
                {formatDate(post.$createdAt)}
              </span>
              <div className='flex items-center'>
                <MapPin />
                <span className='font-semibold'>{post.place}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className='mt-3' />
      <div className='py-5'>
        <div>
          <Link
            href={`/posts/${post.$id}`}
            className='block py-2 w-full text-lg font-semibold rounded-xl hover:bg-gray-50 hover:cursor-pointer'
          >
            {post.title}
          </Link>
          {post.imageUrls.length > 0 &&
            (post.imageUrls.length > 1 ? (
              <PostCarousel imageUrls={post.imageUrls} />
            ) : (
              <div className='relative mt-5 w-full max-h-[500px] aspect-square'>
                <Image
                  src={post.imageUrls[0]}
                  fill
                  alt=''
                  className='border rounded-3xl'
                />
              </div>
            ))}
          {post.coords.length > 0 && (
            <ToggleMap lat={post.coords[0]} lon={post.coords[1]} />
          )}
        </div>
      </div>
      <PostStats post={post} />
    </>
  )
}
