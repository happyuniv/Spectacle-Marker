import { Models } from 'appwrite'
import Image from 'next/image'

import PostStats from './PostStats'
import Link from 'next/link'

type props = {
  posts: Models.Document[]
  showStats?: boolean
}

export default function PostList({ posts, showStats = true }: props) {
  return (
    <>
      <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 py-10 gap-7 w-full max-w-5xl'>
        {posts.map((post) => (
          <li
            key={post.$id}
            className='relative flex flex-col min-w-80 sm:min-w-[280px] h-[320px] border rounded-xl bg-black bg-opacity-5'
          >
            <Link
              href={`/posts/${post.$id}`}
              className='relative w-full h-[280px]'
            >
              <Image
                src={post.imageUrls[0] || '/logo.png'}
                fill
                alt='post'
                className='border rounded-xl object-fill'
              />
            </Link>
            <div className='absolute bottom-0 p-2 w-full rounded-b-xl bg-white'>
              <div className='flex justify-between items-center gap-2 flex-1'>
                <Link
                  href={`/profile/${post.creator.$id}`}
                  className='flex items-center gap-1'
                >
                  <Image
                    src={post.creator.imageUrl}
                    width={24}
                    height={24}
                    alt='creator'
                    className='w-8 h-8 rounded-full'
                  />
                  <span className='line-clamp-1'>{post.creator.username}</span>
                </Link>
                {showStats && <PostStats post={post} />}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
