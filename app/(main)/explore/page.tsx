'use client'

import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Search } from 'lucide-react'

import { useGetPosts, useSearchPosts } from '@/lib/react-query/queries'
import useDebounce from '@/hooks/useDebounce'
import { Loader, PostList } from '@/components/index'

export default function Page() {
  const [searchValue, setSearchValue] = useState('')

  const { ref, inView } = useInView()
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts()


  const debouncedSearch = useDebounce(searchValue, 500)
  const { data: searchedPosts, isFetching: isSearchFetching } =
    useSearchPosts(debouncedSearch)

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView])

  return (
    <>
      <div className='px-12 py-5 md:py-10 w-full'>
        <div className='w-full'>
          <h2 className='text-3xl font-bold'>포스팅 검색</h2>
          <div className='flex gap-3 mt-12 p-3 w-full border rounded-lg'>
            <Search />
            <input
              type='text'
              placeholder='Search'
              onChange={(e) => setSearchValue(e.target.value)}
              className='w-full outline-none'
            />
          </div>
          {!searchValue &&
            posts?.pages.map((item, index) => (
              <PostList key={index} posts={item!.documents} />
            ))}
          {!searchValue && hasNextPage && (
            <div ref={ref}>
              <Loader />
            </div>
          )}
          {}
          {searchValue &&
            searchedPosts &&
            searchedPosts.documents.length > 0 && (
              <PostList posts={searchedPosts.documents} />
            )}
          {searchValue &&
            !isSearchFetching &&
            (!searchedPosts || searchedPosts?.documents.length === 0) && (
              <p className='mt-10 w-full text-light-4 text-center'>
                검색결과가 존재하지 않습니다.
              </p>
            )}
          {searchValue && isSearchFetching && (
            <div>
              <Loader />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
