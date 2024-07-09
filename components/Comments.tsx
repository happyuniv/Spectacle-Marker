'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Models } from 'appwrite'
import { Ellipsis } from 'lucide-react'

import { useDeleteComment, useGetComments } from '@/lib/react-query/queries'
import CommentForm from './CommentForm'
import { formatDate } from '@/lib/utils'
import { useUserContext } from '@/contexts/AuthContext'
import useModal from '@/hooks/useModal'
import Loader from './Loader'

type props = {
  postId: string
}

export default function Comments({ postId }: props) {
  const { user } = useUserContext()
  const { data, isLoading } = useGetComments(postId)
  const { mutateAsync: deleteComment, isPending: isDeleting } =
    useDeleteComment(postId)

  const ref = useRef(null)
  const [isOpen, setIsOpen] = useModal(ref)
  const [modalId, setModalId] = useState('')
  const [editId, setEditId] = useState('')
  const [deleteId, setDeleteId] = useState('')

  const router = useRouter()

  const handleModal = (commentId: string) => {
    setModalId(commentId)
    setIsOpen(!isOpen)
  }

  const handleEdit = (commentId: string) => {
    setEditId(commentId)
    setIsOpen(false)
  }
  const handleDelete = async (commentId: string) => {
    console.log(commentId)
    setDeleteId(commentId)
    await deleteComment(commentId)
    setIsOpen(false)
    setDeleteId('')
  }

  return (
    <>
      <div className='flex-col mt-5 xl:mt-0 xl:pl-14'>
        <div>댓글</div>
        <div className='flex flex-col gap-2 mt-5 w-full sm:min-w-[400px] h-full xl:p-1'>
          <CommentForm postId={postId} action='create' />
          {isLoading && <Loader />}
          {!isLoading && (
            <ul className='flex flex-col gap-5 mt-3 mb-10 h-full xl:overflow-y-auto'>
              {data?.documents.map((comment: Models.Document) => (
                <li key={comment.$id}>
                  {editId === comment.$id && (
                    <CommentForm
                      postId={postId}
                      commentId={editId}
                      setEditId={setEditId}
                      action='update'
                    />
                  )}
                  {editId !== comment.$id && (
                    <div className='flex items-center gap-3'>
                      <div className='flex shrink-0 items-start py-2'>
                        <div
                          onClick={() =>
                            router.push(`/profile/${comment.user.$id}`)
                          }
                          className='relative w-[36px] h-[36px]'
                        >
                          <Image
                            src={`${comment.user.imageUrl}`}
                            fill
                            alt='profile'
                            className='rounded-full'
                          />
                        </div>
                      </div>
                      <div className='flex flex-col gap-2 w-full'>
                        <div className='flex gap-1 text-sm'>
                          <span
                            className='underline'
                            onClick={() =>
                              router.push(`/profile/${comment.user.$id}`)
                            }
                          >
                            {comment.user.username}
                          </span>
                          <span className='text-gray-500'>
                            {formatDate(comment.$createdAt)}
                          </span>
                          {comment.user.$id === user.id && (
                            <div className='relative ml-auto'>
                              {isDeleting && comment.$id === deleteId && (
                                <Loader />
                              )}
                              {!isDeleting && (
                                <>
                                  <Ellipsis
                                    ref={comment.$id === modalId ? ref : null}
                                    onClick={() => handleModal(comment.$id)}
                                    className='hover:opacity-50 hover:cursor-pointer'
                                  />
                                  {isOpen && modalId === comment.$id && (
                                    <ul className='absolute flex flex-col top-5 right-1 min-w-[100px] bg-white text-center bg-opacity-100 shadow z-10'>
                                      <li
                                        className='px-5 py-2 hover:bg-lime-300 hover:cursor-pointer'
                                        onClick={() => handleEdit(comment.$id)}
                                      >
                                        수정
                                      </li>
                                      <li
                                        className='px-5 py-2 hover:bg-lime-300 hover:cursor-pointer'
                                        onClick={() =>
                                          handleDelete(comment.$id)
                                        }
                                      >
                                        삭제
                                      </li>
                                    </ul>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                        <div className='break-all'>{comment.content}</div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
