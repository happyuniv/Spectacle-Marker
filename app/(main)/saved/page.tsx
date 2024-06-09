'use client'

import { Models } from 'appwrite'

import { useGetCurrentUser } from '@/lib/react-query/queries'
import { Loader, PostList } from '@/components/index'
import { useUserContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function Page() {
  const { data: currentUser } = useGetCurrentUser()
  const {
    user,
    setUser,
    isAuthenticated,
    isLoading: isLoadingUser,
  } = useUserContext()

  const router = useRouter()

  if (isLoadingUser) return <Loader />
  if (!isAuthenticated) {
    router.push('/signin')
    return
  }

  if (!currentUser)
    return (
      <div className='flex-center w-full h-full'>
        <Loader />
      </div>
    )

  const savedPosts = currentUser.saves.map((record: Models.Document) => ({
    ...record.post,
    creator: {
      $id: currentUser.$id,
      username: currentUser.username,
      imageUrl: currentUser.imageUrl,
    },
  }))

  return (
    <>
      <div className='px-12 py-10 w-full'>
        <div className='w-full'>
          <h2 className='text-3xl font-bold'>저장된 포스팅</h2>
          <PostList posts={savedPosts} showStats={false} />
        </div>
      </div>
    </>
  )
}
