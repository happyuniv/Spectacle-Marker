'use client'

import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

import { useGetPosts } from '@/lib/react-query/queries'
import { PostCardList, Loader } from '@/components/index'

export default function Page() {
  const { ref, inView } = useInView()
  const { data: posts, fetchNextPage, hasNextPage, isError } = useGetPosts()

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView])

  return (
    <>
      <div className='px-12 md:py-10 w-full'>
        <div className='max-w-3xl w-full h-fit'>
          <h2 className='mt-5 sm:mt-0 text-3xl font-bold'>최신 피드</h2>
          <div className='flex flex-col gap-10 mt-16'>
            {posts?.pages.map((item, index) => (
              <PostCardList key={index} posts={item!.documents} />
            ))}
            {!isError && hasNextPage && (
              <div ref={ref}>
                <Loader />
              </div>
            )}
            {isError && (
              <div className='flex justify-center w-full'>
                <div>페이지를 로드하는데 오류가 발생했습니다</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
