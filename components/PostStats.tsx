'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Models } from 'appwrite'
import { useEffect, useState } from 'react'
import { Bookmark, Heart, MessageSquare } from 'lucide-react'

import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from '@/lib/react-query/queries'
import Loader from './Loader'

type props = {
  post: any
}

export default function PostStats({ post }: props) {
  const likesList = post.likes.map((user: Models.Document) => user.$id)

  const [likes, setLikes] = useState<string[]>(likesList)
  const [isSaved, setIsSaved] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)

  const router = useRouter()
  const { data: currentUser } = useGetCurrentUser()
  const { mutate: likePost } = useLikePost()
  const { mutateAsync: savePost } = useSavePost()
  const { mutateAsync: deleteSavePost } = useDeleteSavedPost()

  const userId = currentUser?.$id
  const checkIsLiked = userId && likes.includes(userId)
  const savedPostRecord = currentUser?.saves.find(
    (record: Models.Document) => record.post.$id === post.$id
  )

  useEffect(() => {
    setIsSaved(!!savedPostRecord)
  }, [currentUser])

  const handleLikePost = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!userId) {
      router.push('/signin')
      return
    }

    e.stopPropagation()

    let likesArray = [...likes]

    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((Id) => Id !== userId)
    } else {
      likesArray.push(userId)
    }

    setLikes(likesArray)
    likePost({ postId: post.$id, likesArray })
  }

  const handleSavePost = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    if (!userId) {
      router.push('/signin')
      return
    }

    e.stopPropagation()

    setSaveLoading(true)
    if (savedPostRecord) {
      setIsSaved(false)
      await deleteSavePost(savedPostRecord.$id)
      setSaveLoading(false)
      return
    }

    await savePost({ userId: userId, postId: post.$id })
    setIsSaved(true)
    setSaveLoading(false)
  }

  return (
    <>
      <div className='flex justify-between'>
        <div className='flex items-center gap-1 '>
          <Heart
            color='#ff0000'
            fill={`${checkIsLiked ? '#ff0000' : '#ffffff'}`}
            onClick={handleLikePost}
            className='hover:cursor-pointer'
          />
          <span className='text-sm'>{likes.length}</span>
        </div>
        <div className='flex gap-3'>
          {saveLoading && <Loader />}
          {!saveLoading && (
            <Bookmark
              fill={`${isSaved ? '#000000' : '#ffffff'}`}
              onClick={handleSavePost}
              className='hover:cursor-pointer'
            />
          )}
          <Link
            href={`/posts/${post.$id}`}
            className='flex items-center gap-1 hover:cursor-pointer'
          >
            <MessageSquare className='hover:fill-gray-100' />
            <span className='text-sm font-bold'>{post.comments.length}</span>
          </Link>
        </div>
      </div>
    </>
  )
}
