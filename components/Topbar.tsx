'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin } from 'lucide-react'

import { useSignOutAccount } from '@/lib/react-query/queries'
import { useUserContext } from '@/contexts/AuthContext'
import { Button } from './ui'
import Loader from './Loader'

export default function Topbar() {
  const { user, isAuthenticated, checkAuthUser, isLoading } = useUserContext()
  const { mutateAsync: signOut, isPending } = useSignOutAccount()

  const handleLogout = async () => {
    await signOut()
    await checkAuthUser()
  }

  return (
    <>
      <div className='fixed flex md:justify-end justify-between items-center px-5 py-3 max-w-[1600px] w-full h-[50px] border-b-2 bg-white z-10'>
        <Link
          href={'/'}
          className='md:hidden flex justify-center items-center gap-1'
        >
          <MapPin />
          <span className='font-extrabold'>Spectacle Marker</span>
        </Link>
        <div className='flex gap-5'>
          {(isLoading || isPending) && <Loader />}
          {!isLoading && !isPending && isAuthenticated && (
            <div className='flex items-center gap-8'>
              <Link
                href={`/profile/${user.id}`}
                className='flex items-center gap-2'
              >
                <Image
                  src={user.imageUrl}
                  width={30}
                  height={30}
                  alt='profile'
                  className='h-[30px] rounded-full'
                />
                <span>프로필</span>
              </Link>
              <Button onClick={handleLogout}>로그아웃</Button>
            </div>
          )}
          {!isLoading && !isPending && !isAuthenticated && (
            <>
              <Link href={'/signin'}>로그인</Link>
              <Link href={'/signup'}>회원가입</Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}
