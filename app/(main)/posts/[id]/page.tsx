import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Undo2 } from 'lucide-react'

import { getPostById } from '@/lib/appwrite/api'
import { formatDate } from '@/lib/utils'
import {
  PostCarousel,
  Comments,
  ToggleMap,
  PostStats,
  PostDotMenu,
} from '@/components/index'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const post = await getPostById(params.id)

  return {
    title: post?.title,
    description: `${post?.place} ${post?.title}`,
  }
}

export default async function page({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id)!

  if (!post) return <div>포스팅이 존재하지 않습니다</div>

  return (
    <>
      <div className='px-12 py-5 w-full'>
        <div className='w-full h-fit'>
          <Link
            href={`/#${params.id}`}
            className='flex items-center gap-1 p-2 w-fit rounded-lg hover:bg-gray-100'
          >
            <Undo2 />
            <span className='text-sm font-bold'>뒤로</span>
          </Link>
          <div className='flex flex-col xl:flex-row mt-5'>
            <div className='w-full'>
              <div className='flex gap-3'>
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
                    <div className='flex gap-3 text-sm'>
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
              <div className='mt-1'>
                <div className='py-5'>
                  <h1 className='py-2 text-lg font-semibold'>{post.title}</h1>
                  {post!.imageUrls.length > 0 &&
                    (post!.imageUrls.length > 1 ? (
                      <PostCarousel imageUrls={post.imageUrls} />
                    ) : (
                      <div className='relative mt-5 w-full h-[500px]'>
                        <Image src={post.imageUrls[0]} fill alt='' />
                      </div>
                    ))}
                  {post.coords.length > 0 && (
                    <ToggleMap lat={post.coords[0]} lon={post.coords[1]} />
                  )}
                </div>
                <PostStats post={post} />
              </div>
            </div>
            <Comments postId={params.id} />
          </div>
        </div>
      </div>
    </>
  )
}
