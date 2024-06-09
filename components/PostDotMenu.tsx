'use client'

import { useRef, useState } from 'react'
import { Models } from 'appwrite'
import { Ellipsis, Trash } from 'lucide-react'

import { useUserContext } from '@/contexts/AuthContext'
import useModal from '@/hooks/useModal'
import { useDeletePost } from '@/lib/react-query/queries'
import Loader from './Loader'

type props = {
  post: Models.Document
}

export default function PostDotMenu({ post }: props) {
  const ref = useRef(null)
  const [isOpen, setIsOpen] = useModal(ref)
  const [modalId, setModalId] = useState('')

  const { user } = useUserContext()
  const { mutateAsync: deletePost, isPending } = useDeletePost()

  const handleModal = (postId: string) => {
    setModalId(postId)
    setIsOpen(!isOpen)
  }

  const handleDelete = async (postId: string, imageIds: string[]) => {
    await deletePost({ postId, imageIds })
    setIsOpen(false)
  }
  return (
    <>
      {post.creator.$id === user.id && (
        <div className='relative ml-auto'>
          {isPending && <Loader />}
          {!isPending && (
            <>
              <Ellipsis
                ref={ref}
                onClick={() => handleModal(post.$id)}
                className='hover:opacity-50 hover:cursor-pointer'
              />
              {isOpen && modalId === post.$id && (
                <ul className='absolute flex flex-col top-5 right-1 min-w-[100px] bg-white text-center bg-opacity-100 shadow z-10'>
                  <li
                    className='flex gap-1 px-5 py-2 hover:bg-lime-300 hover:cursor-pointer'
                    onClick={() => handleDelete(post.$id, post.imageIds)}
                  >
                    <Trash color='#ff0000' />
                    삭제
                  </li>
                </ul>
              )}
            </>
          )}
        </div>
      )}
    </>
  )
}
