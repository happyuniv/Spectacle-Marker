'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ImageUp, Plus, X } from 'lucide-react'

import { useCreatePost } from '@/lib/react-query/queries'
import { useUserContext } from '@/contexts/AuthContext'
import { Switch, Button, useToast } from '@/components/ui'
import { KakaoMap, Loader } from '@/components/index'

type fileObj = {
  previewUrl: string
  file: File
}

export type mapObj = {
  place: string
  coords: number[]
}

export default function Page() {
  const [title, setTitle] = useState('')
  const [userFiles, setUserFiles] = useState([] as fileObj[])
  const [mapInfo, setMapInfo] = useState({ place: '', coords: [] } as mapObj)
  const [activeMap, setActiveMap] = useState(true)

  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated, isLoading: isLoadingUser } = useUserContext()
  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost()

  useEffect(() => {
    return () => {
      for (let i = 0; i < userFiles.length; i++)
        URL.revokeObjectURL(userFiles[i].previewUrl)
    }
  }, [])

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.height = 'auto'
    e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'
    setTitle(e.currentTarget.value)
  }

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = e.target.files
    const temp = [...userFiles]
    for (let i = 0; i < files.length; i++) {
      temp.push({
        file: files[i],
        previewUrl: URL.createObjectURL(files[i]),
      })
      if (temp.length >= 8) break
    }
    setUserFiles(temp)
  }

  const handleDeleteImage = (url: string) => {
    URL.revokeObjectURL(url)
    setUserFiles(userFiles.filter((obj) => obj.previewUrl !== url))
  }

  const handleCancle = () => {
    if (confirm('글 작성을 취소하시겠습니까? 저장된 정보가 삭제됩니다.')) {
      router.push('/')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const files = userFiles.map((userFile) => userFile.file)
    const newPost = await createPost({
      userId: user.id,
      title: title,
      files: files,
      place: mapInfo.place,
      coords: mapInfo.coords,
    })

    if (!newPost) {
      toast({
        title: `포스팅 생성중 오류가 발생했습니다.`,
      })
    }

    router.push('/')
  }

  if (isLoadingUser) return <Loader />
  if (!isAuthenticated) {
    router.push('/signin')
    return
  }

  return (
    <>
      <div className='px-12 py-10 w-full'>
        <div className='w-full'>
          <h2 className='text-3xl font-bold'>글 작성</h2>

          <form
            onSubmit={handleSubmit}
            className='flex flex-col gap-5 mt-12 max-w-[600px]'
          >
            <div className='relative flex'>
              <textarea
                onInput={handleInput}
                minLength={1}
                maxLength={300}
                required
                placeholder='Title'
                className='pl-3 pr-12 py-2 w-full border rounded-md overflow-y-hidden resize-none'
              />

              <span className='absolute right-2 bottom-2 text-xs text-gray-500'>
                {title.length}/300
              </span>
            </div>
            {userFiles.length === 0 && (
              <label className='flex flex-col justify-center items-center max-w-[600px] h-[300px] border-2 border-dashed rounded text-lg font-bold transition-all hover:bg-lime-50 hover:cursor-pointer'>
                <div>
                  <ImageUp />
                </div>
                <span>이미지 업로드</span>
                <p className='mt-2 text-gray-500 text-sm'>
                  클릭해 이미지를 업로드하세요
                </p>
                <input
                  className='hidden'
                  type={'file'}
                  accept='image/*'
                  multiple
                  onChange={handleAddImage}
                />
              </label>
            )}

            {userFiles.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {userFiles.map((obj, index) => (
                  <div
                    key={index}
                    className='relative p-5 w-[100px] h-[100px] border-2 rounded border-black'
                  >
                    <Image
                      src={obj.previewUrl}
                      fill
                      alt='uploaded-image'
                      className='p-1 object-cover'
                    />
                    <X
                      color='#ff0000'
                      className='absolute top-0 right-0 hover:cursor-pointer'
                      onClick={() => handleDeleteImage(obj.previewUrl)}
                    />
                  </div>
                ))}
                {userFiles.length < 8 && (
                  <label className='flex justify-center items-center w-[100px] h-[100px] border-2 border-dashed hover:cursor-pointer'>
                    <Plus width={48} height={48} className='hover:opacity-10' />
                    <input
                      className='hidden'
                      type={'file'}
                      accept='.jpg, .jpeg, .png'
                      multiple
                      onChange={handleAddImage}
                    />
                  </label>
                )}
              </div>
            )}
            <div className='flex items-center gap-2'>
              <span className='font-semibold'>지도추가</span>
              <Switch
                checked={activeMap}
                onCheckedChange={(e) => {
                  if (e.valueOf()) setActiveMap(true)
                  else {
                    setActiveMap(false)
                    setMapInfo({ place: '', coords: [] })
                  }
                }}
              />
            </div>

            {activeMap && (
              <KakaoMap mapInfo={mapInfo} setMapInfo={setMapInfo} />
            )}
            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                disabled={isLoadingCreate}
                onClick={handleCancle}
                className='text-black bg-white hover:bg-white'
              >
                취소
              </Button>
              <Button disabled={isLoadingCreate} type='submit'>
                {isLoadingCreate ? <Loader /> : '작성완료'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
