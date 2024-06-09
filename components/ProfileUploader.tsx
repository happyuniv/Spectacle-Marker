'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Pencil } from 'lucide-react'

type props = {
  fieldChange: (files: File[]) => void
  profileUrl: string
}

export default function ProfileUploader({ fieldChange, profileUrl }: props) {
  const [fileUrl, setFileUrl] = useState<string>(profileUrl)

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(fileUrl)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    setFileUrl(URL.createObjectURL(files[0]))
    fieldChange(files)
  }

  return (
    <>
      <div className='flex items-center gap-5'>
        <Image
          src={fileUrl}
          width={96}
          height={96}
          alt='profile'
          className='h-[96px] rounded-full'
        />
        <label className='hover:cursor-pointer'>
          <Pencil width={24} height={24} className='hover:opacity-10' />
          <input
            className='hidden'
            type={'file'}
            accept='.jpg, .jpeg, .png'
            onChange={handleChange}
          />
        </label>
      </div>
    </>
  )
}
